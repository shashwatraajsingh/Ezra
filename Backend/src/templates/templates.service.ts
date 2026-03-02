import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

import { Template, TemplateKind } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplatesService {
    constructor(
        @InjectRepository(Template)
        private readonly templateRepo: Repository<Template>,
    ) { }

    /** Return all prebuilt templates (visible to everyone). */
    findAllPrebuilt(): Promise<Template[]> {
        return this.templateRepo.find({
            where: { kind: TemplateKind.PREBUILT },
            order: { name: 'ASC' },
        });
    }

    /** Return templates uploaded by a specific student. */
    findByStudent(studentId: number): Promise<Template[]> {
        return this.templateRepo.find({
            where: { kind: TemplateKind.USER_UPLOADED, studentId },
            order: { createdAt: 'DESC' },
        });
    }

    /** Return one template (guards ownership for user-uploaded ones). */
    async findOne(id: number, requesterId?: number): Promise<Template> {
        const tpl = await this.templateRepo.findOne({ where: { id } });
        if (!tpl) throw new NotFoundException(`Template #${id} not found`);
        if (
            tpl.kind === TemplateKind.USER_UPLOADED &&
            tpl.studentId !== requesterId
        ) {
            throw new NotFoundException(`Template #${id} not found`);
        }
        return tpl;
    }

    /** Seed / create a prebuilt template (admin-only in production). */
    create(dto: CreateTemplateDto, latexSource?: string): Promise<Template> {
        const tpl = this.templateRepo.create({
            ...dto,
            latexSource: latexSource ?? null,
        });
        return this.templateRepo.save(tpl);
    }

    /**
     * Handle a user-uploaded file:
     * 1. Persist the raw file reference.
     * 2. (Stub) Run AI processing to extract LaTeX and placeholders.
     * 3. Save & return the resulting Template row.
     */
    async handleUpload(
        studentId: number,
        file: Express.Multer.File,
        dto: CreateTemplateDto,
    ): Promise<Template> {
        const allowed = ['.pdf', '.docx', '.tex'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
            throw new BadRequestException(
                `Unsupported file type "${ext}". Allowed: ${allowed.join(', ')}`,
            );
        }

        // Persist file (multer already wrote it to disk/memory)
        const fileRef = `/uploads/templates/${file.filename}`;

        // AI processing stub — replace with real Gemini / OpenAI call
        const { latexSource, placeholders } = await this.runAiProcessing(
            file.buffer ?? fs.readFileSync(file.path),
            ext,
            dto.name,
        );

        const tpl = this.templateRepo.create({
            name: dto.name,
            description: dto.description ?? null,
            kind: TemplateKind.USER_UPLOADED,
            fileRef,
            latexSource,
            placeholders,
            studentId,
        });

        return this.templateRepo.save(tpl);
    }

    /** AI stub — returns a bare-bones LaTeX template for now. */
    private async runAiProcessing(
        _buffer: Buffer,
        _ext: string,
        name: string,
    ): Promise<{ latexSource: string; placeholders: string[] }> {
        const placeholders = [
            '{{name}}',
            '{{email}}',
            '{{phone}}',
            '{{summary}}',
            '{{experience}}',
            '{{education}}',
            '{{skills}}',
        ];

        const latexSource = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym,fullpage,titlesec,marvosym,verbatim,enumitem,hyperref,fancyhdr,tabularx,amsmath,graphicx}
\\pagestyle{fancy}\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\begin{document}

% Generated from: ${name}
% Replace placeholders with your data

\\begin{center}
  {\\Huge \\scshape {{name}}} \\\\[4pt]
  {{email}} $|$ {{phone}}
\\end{center}

\\section*{Summary}
{{summary}}

\\section*{Experience}
{{experience}}

\\section*{Education}
{{education}}

\\section*{Skills}
{{skills}}

\\end{document}`;

        return { latexSource, placeholders };
    }

    async remove(id: number, studentId: number): Promise<void> {
        const tpl = await this.findOne(id, studentId);
        await this.templateRepo.remove(tpl);
    }
}
