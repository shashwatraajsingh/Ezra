import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { Resume, ResumeProjectFile, ResumeStatus } from './entities/resume.entity';
import { Template } from '../templates/entities/template.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

const execFileAsync = promisify(execFile);

/** pdflatex is run twice so cross-references resolve correctly. */
const PDFLATEX_FLAGS = '-interaction=nonstopmode -halt-on-error -file-line-error';
const COMPILE_TIMEOUT_MS = 60_000;
const PDFLATEX_CANDIDATES = [
    process.env.PDFLATEX_BIN,
    '/usr/bin/pdflatex',
    'pdflatex',
].filter(Boolean) as string[];

/** Extracts the most useful lines from pdflatex stderr/stdout. */
function extractLatexError(output: string): string {
    const lines = output.split('\n');
    const errorLines = lines.filter(
        (l) => l.startsWith('!') || l.match(/^.*:\d+:/) || l.includes('Error'),
    );
    return (errorLines.length > 0 ? errorLines : lines)
        .slice(0, 20)
        .join('\n')
        .trim()
        .slice(0, 2000);
}

/** Replace {{key}} tokens with their values from the field map. */
function interpolate(latex: string, fields: Record<string, string> | null): string {
    if (!fields) return latex;
    return Object.entries(fields).reduce(
        (src, [key, val]) => src.replaceAll(`{{${key}}}`, val),
        latex,
    );
}

function findMainProjectFile(projectFiles: ResumeProjectFile[] | null): ResumeProjectFile | null {
    if (!projectFiles?.length) return null;

    return (
        projectFiles.find((file) => file.name === 'main.tex')
        ?? projectFiles.find((file) => file.language === 'latex')
        ?? null
    );
}

function sanitizeProjectFilePath(fileName: string): string {
    const normalized = path.posix.normalize(fileName).replace(/^\/+/, '');
    if (!normalized || normalized.startsWith('..') || normalized.includes('\0')) {
        throw new BadRequestException(`Invalid project file path: ${fileName}`);
    }
    return normalized;
}

async function resolvePdflatexBinary(): Promise<string> {
    for (const candidate of PDFLATEX_CANDIDATES) {
        if (candidate.includes('/')) {
            try {
                await fsp.access(candidate, fs.constants.X_OK);
                return candidate;
            } catch {
                continue;
            }
        }

        return candidate;
    }

    throw new Error('pdflatex executable not found');
}

@Injectable()
export class ResumesService {
    private readonly logger = new Logger(ResumesService.name);

    /**
     * Deduplication map: key = `${studentId}:${resumeId}`
     * Value = the in-flight compile promise.
     * Prevents a user from queueing N identical compile jobs by clicking
     * Recompile repeatedly.
     */
    private readonly compileJobs = new Map<string, Promise<Resume>>();

    constructor(
        @InjectRepository(Resume)
        private readonly resumeRepo: Repository<Resume>,
        @InjectRepository(Template)
        private readonly templateRepo: Repository<Template>,
    ) { }

    // ─── Queries ──────────────────────────────────────────────────────────────

    list(studentId: number): Promise<Resume[]> {
        return this.resumeRepo.find({
            where: { studentId },
            order: { updatedAt: 'DESC' },
            relations: ['template'],
            select: {
                id: true, title: true, atsScore: true, status: true,
                compiledPdfPath: true, updatedAt: true, createdAt: true,
                templateId: true, studentId: true, latexSource: false,
            } as never,
        });
    }

    async findOne(id: number, studentId: number): Promise<Resume> {
        const resume = await this.resumeRepo.findOne({
            where: { id, studentId },
            relations: ['template'],
        });
        if (!resume) throw new NotFoundException(`Resume #${id} not found`);
        return resume;
    }

    // ─── Mutations ────────────────────────────────────────────────────────────

    async create(studentId: number, dto: CreateResumeDto): Promise<Resume> {
        let latexSource: string | null = dto.latexSource ?? null;

        if (dto.templateId && !latexSource) {
            const tpl = await this.templateRepo.findOne({ where: { id: dto.templateId } });
            if (!tpl) throw new NotFoundException(`Template #${dto.templateId} not found`);
            latexSource = tpl.latexSource ?? null;
        }

        const projectFiles = dto.projectFiles ?? null;
        const mainProjectFile = findMainProjectFile(projectFiles);
        if (!latexSource && mainProjectFile) {
            latexSource = mainProjectFile.content;
        }

        const resume = this.resumeRepo.create({
            title: dto.title,
            studentId,
            templateId: dto.templateId ?? null,
            latexSource,
            projectFiles,
            status: ResumeStatus.DRAFT,
        });

        const saved = await this.resumeRepo.save(resume);
        this.logger.log(`Resume #${saved.id} created for student #${studentId}`);
        return saved;
    }

    async update(id: number, studentId: number, dto: UpdateResumeDto): Promise<Resume> {
        const resume = await this.findOne(id, studentId);

        if (dto.title !== undefined) resume.title = dto.title;

        // LaTeX edits: store as-is; interpolation happens only at compile time
        if (dto.latexSource !== undefined) resume.latexSource = dto.latexSource;

        // Form field updates: store the updated map, never mutate latexSource
        if (dto.fieldValues !== undefined) {
            resume.fieldValues = { ...resume.fieldValues, ...dto.fieldValues };
        }

        if (dto.projectFiles !== undefined) {
            resume.projectFiles = dto.projectFiles;
            const mainProjectFile = findMainProjectFile(dto.projectFiles);
            if (mainProjectFile) {
                resume.latexSource = mainProjectFile.content;
            }
        }

        resume.status = ResumeStatus.DRAFT;
        return this.resumeRepo.save(resume);
    }

    async remove(id: number, studentId: number): Promise<void> {
        const resume = await this.findOne(id, studentId);

        // Clean up compiled PDF if present
        if (resume.compiledPdfPath) {
            const abs = path.join(process.cwd(), 'public', resume.compiledPdfPath);
            await fsp.rm(abs, { force: true });
        }

        await this.resumeRepo.remove(resume);
        this.logger.log(`Resume #${id} deleted by student #${studentId}`);
    }

    // ─── Compilation ─────────────────────────────────────────────────────────

    /**
     * Compiles a resume's LaTeX to PDF using pdflatex.
     *
     * Key guarantees:
     *  1. Duplicate calls for the same resume return the same in-flight Promise
     *     (deduplication via `compileJobs` map).
     *  2. Field values are merged into the LaTeX only at compile time — the
     *     stored `latexSource` always retains the raw template with placeholders.
     *  3. pdflatex runs twice so cross-references/headers resolve correctly.
     *  4. Temp directory is always cleaned up, even on error.
     *  5. PDF is written atomically (tmp file → rename) to prevent partial reads.
     */
    async compile(id: number, studentId: number): Promise<Resume> {
        const jobKey = `${studentId}:${id}`;

        const existing = this.compileJobs.get(jobKey);
        if (existing) {
            this.logger.debug(`Reusing in-flight compile for ${jobKey}`);
            return existing;
        }

        const job = this.runCompile(id, studentId);
        this.compileJobs.set(jobKey, job);

        try {
            return await job;
        } finally {
            this.compileJobs.delete(jobKey);
        }
    }

    private async runCompile(id: number, studentId: number): Promise<Resume> {
        const resume = await this.findOne(id, studentId);

        const mainProjectFile = findMainProjectFile(resume.projectFiles);

        if (!resume.latexSource && !mainProjectFile) {
            throw new BadRequestException('Resume has no LaTeX source to compile.');
        }

        const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'ezra-'));
        const pdfFile = path.join(tmpDir, 'resume.pdf');

        const startedAt = Date.now();
        this.logger.log(`Compiling resume #${id} for student #${studentId}`);

        try {
            let texFile: string;

            if (mainProjectFile) {
                for (const projectFile of resume.projectFiles ?? []) {
                    const safeName = sanitizeProjectFilePath(projectFile.name);
                    const absPath = path.join(tmpDir, safeName);
                    await fsp.mkdir(path.dirname(absPath), { recursive: true });

                    const content = projectFile.language === 'latex'
                        ? interpolate(projectFile.content, resume.fieldValues)
                        : projectFile.content;

                    await fsp.writeFile(absPath, content, 'utf8');
                }

                texFile = path.join(tmpDir, sanitizeProjectFilePath(mainProjectFile.name));
            } else {
                // Merge form field values at compile time — never persisted into latexSource
                const finalLatex = interpolate(resume.latexSource!, resume.fieldValues);
                texFile = path.join(tmpDir, 'resume.tex');
                await fsp.writeFile(texFile, finalLatex, 'utf8');
            }

            // Run pdflatex twice: first pass builds the document,
            // second pass resolves forward references and headers.
            const pdflatexBin = await resolvePdflatexBinary();
            const pdflatexArgs = [
                ...PDFLATEX_FLAGS.split(' '),
                `-output-directory=${tmpDir}`,
                texFile,
            ];

            for (let pass = 1; pass <= 2; pass++) {
                const { stdout, stderr } = await execFileAsync(pdflatexBin, pdflatexArgs, {
                    timeout: COMPILE_TIMEOUT_MS,
                    maxBuffer: 10 * 1024 * 1024, // 10 MB output buffer
                    cwd: tmpDir, // ensure relative \input{} paths work
                }).catch((err: NodeJS.ErrnoException & { stdout?: string; stderr?: string }) => {
                    throw new Error(
                        extractLatexError((err.stdout ?? '') + (err.stderr ?? '')),
                    );
                });

                // pdflatex exits 0 even on some errors; verify PDF was produced
                if (pass === 2 && !fs.existsSync(pdfFile)) {
                    throw new Error(
                        extractLatexError(stdout + stderr),
                    );
                }
            }

            // Atomic write: write to a tmp name then rename
            const destRel = `/uploads/compiled/${studentId}-${id}-${Date.now()}.pdf`;
            const destAbs = path.join(process.cwd(), 'public', destRel);
            const destTmp = `${destAbs}.tmp`;

            await fsp.mkdir(path.dirname(destAbs), { recursive: true });
            await fsp.copyFile(pdfFile, destTmp);
            await fsp.rename(destTmp, destAbs);

            // Delete previous compiled PDF to avoid orphaned files
            if (resume.compiledPdfPath) {
                const oldAbs = path.join(process.cwd(), 'public', resume.compiledPdfPath);
                await fsp.rm(oldAbs, { force: true });
            }

            resume.compiledPdfPath = destRel;
            resume.status = ResumeStatus.COMPILED;
            resume.compileError = null;

            const elapsed = Date.now() - startedAt;
            this.logger.log(`Resume #${id} compiled in ${elapsed}ms → ${destRel}`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.warn(`Resume #${id} compile failed: ${msg.slice(0, 200)}`);
            resume.status = ResumeStatus.ERROR;
            resume.compileError = msg.slice(0, 2000);
        } finally {
            await fsp.rm(tmpDir, { recursive: true, force: true });
        }

        return this.resumeRepo.save(resume);
    }

    // ─── Download ─────────────────────────────────────────────────────────────

    /**
     * Returns a StreamableFile of the compiled PDF.
     * Ownership is verified before the file is opened.
     */
    async getCompiledPdfStream(
        id: number,
        studentId: number,
    ): Promise<{ stream: StreamableFile; filename: string }> {
        const resume = await this.findOne(id, studentId);

        if (!resume.compiledPdfPath || resume.status !== ResumeStatus.COMPILED) {
            throw new BadRequestException(
                'This resume has not been compiled yet. Run Recompile first.',
            );
        }

        const absPath = path.join(process.cwd(), 'public', resume.compiledPdfPath);

        try {
            await fsp.access(absPath, fs.constants.R_OK);
        } catch {
            throw new NotFoundException('Compiled PDF not found on disk. Please recompile.');
        }

        const filename = `${resume.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        const stream = new StreamableFile(fs.createReadStream(absPath));
        return { stream, filename };
    }
}
