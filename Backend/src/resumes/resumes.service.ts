import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { Resume, ResumeStatus } from './entities/resume.entity';
import { Template } from '../templates/entities/template.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

const execAsync = promisify(exec);

@Injectable()
export class ResumesService {
    constructor(
        @InjectRepository(Resume)
        private readonly resumeRepo: Repository<Resume>,
        @InjectRepository(Template)
        private readonly templateRepo: Repository<Template>,
    ) { }

    /** List all resumes for a student, newest first. */
    list(studentId: number): Promise<Resume[]> {
        return this.resumeRepo.find({
            where: { studentId },
            order: { updatedAt: 'DESC' },
            relations: ['template'],
        });
    }

    /** Get a single resume (ownership-guarded). */
    async findOne(id: number, studentId: number): Promise<Resume> {
        const resume = await this.resumeRepo.findOne({
            where: { id, studentId },
            relations: ['template'],
        });
        if (!resume) throw new NotFoundException(`Resume #${id} not found`);
        return resume;
    }

    /** Create a new blank resume, optionally seeded from a template. */
    async create(studentId: number, dto: CreateResumeDto): Promise<Resume> {
        let latexSource = dto.latexSource ?? null;

        if (dto.templateId && !latexSource) {
            const tpl = await this.templateRepo.findOne({
                where: { id: dto.templateId },
            });
            if (!tpl) throw new NotFoundException(`Template #${dto.templateId} not found`);
            latexSource = tpl.latexSource ?? null;
        }

        const resume = this.resumeRepo.create({
            title: dto.title,
            studentId,
            templateId: dto.templateId ?? null,
            latexSource,
            status: ResumeStatus.DRAFT,
        });

        return this.resumeRepo.save(resume);
    }

    /** Update LaTeX source and/or field values. */
    async update(
        id: number,
        studentId: number,
        dto: UpdateResumeDto,
    ): Promise<Resume> {
        const resume = await this.findOne(id, studentId);

        if (dto.title !== undefined) resume.title = dto.title;
        if (dto.latexSource !== undefined) resume.latexSource = dto.latexSource;
        if (dto.fieldValues !== undefined) {
            resume.fieldValues = dto.fieldValues;
            // Inject field values into LaTeX
            if (resume.latexSource) {
                let compiled = resume.latexSource;
                for (const [key, val] of Object.entries(dto.fieldValues)) {
                    compiled = compiled.replaceAll(`{{${key}}}`, val);
                }
                resume.latexSource = compiled;
            }
        }

        resume.status = ResumeStatus.DRAFT;
        return this.resumeRepo.save(resume);
    }

    /**
     * Compile the LaTeX source to PDF server-side.
     * Requires `pdflatex` to be installed on the server.
     * Falls back gracefully with an error status if unavailable.
     */
    async compile(id: number, studentId: number): Promise<Resume> {
        const resume = await this.findOne(id, studentId);

        if (!resume.latexSource) {
            throw new BadRequestException('Resume has no LaTeX source to compile');
        }

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ezra-'));
        const texFile = path.join(tmpDir, 'resume.tex');
        const pdfFile = path.join(tmpDir, 'resume.pdf');

        try {
            fs.writeFileSync(texFile, resume.latexSource, 'utf8');

            await execAsync(
                `pdflatex -interaction=nonstopmode -output-directory="${tmpDir}" "${texFile}"`,
                { timeout: 30_000 },
            );

            if (!fs.existsSync(pdfFile)) {
                throw new Error('pdflatex exited without producing a PDF');
            }

            // In production: move PDF to a CDN/storage bucket and store URL.
            // For now, persist local path.
            const dest = `/uploads/compiled/${studentId}-${id}-${Date.now()}.pdf`;
            const destAbs = path.join(process.cwd(), 'public', dest);
            fs.mkdirSync(path.dirname(destAbs), { recursive: true });
            fs.copyFileSync(pdfFile, destAbs);

            resume.compiledPdfPath = dest;
            resume.status = ResumeStatus.COMPILED;
            resume.compileError = null;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            resume.status = ResumeStatus.ERROR;
            resume.compileError = msg.slice(0, 2000); // cap length
        } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }

        return this.resumeRepo.save(resume);
    }

    async remove(id: number, studentId: number): Promise<void> {
        const resume = await this.findOne(id, studentId);
        await this.resumeRepo.remove(resume);
    }
}
