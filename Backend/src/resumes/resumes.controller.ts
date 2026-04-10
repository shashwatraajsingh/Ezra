import {
    Body,
    Controller,
    Delete,
    Get,
    Header,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Request,
    Res,
    StreamableFile,
    UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

type AuthRequest = { user: { sub: number } };

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
    constructor(private readonly service: ResumesService) { }

    /** GET /resumes — list caller's resumes (LaTeX source excluded for perf) */
    @Get()
    list(@Request() req: AuthRequest) {
        return this.service.list(req.user.sub);
    }

    /** GET /resumes/:id — single resume with full LaTeX source */
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthRequest,
    ) {
        return this.service.findOne(id, req.user.sub);
    }

    /** POST /resumes — create from scratch or from a template */
    @Post()
    create(@Request() req: AuthRequest, @Body() dto: CreateResumeDto) {
        return this.service.create(req.user.sub, dto);
    }

    /** PATCH /resumes/:id — update title, latexSource, or fieldValues */
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthRequest,
        @Body() dto: UpdateResumeDto,
    ) {
        return this.service.update(id, req.user.sub, dto);
    }

    /** POST /resumes/:id/compile — server-side pdflatex compilation */
    @Post(':id/compile')
    compile(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthRequest,
    ) {
        return this.service.compile(id, req.user.sub);
    }

    /**
     * GET /resumes/:id/download
     *
     * Streams the compiled PDF directly to the browser.
     * Sets Content-Disposition: attachment so the browser saves the file.
     * Authorization is enforced — only the owner can download their resume.
     */
    @Get(':id/download')
    @Header('Content-Type', 'application/pdf')
    async download(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<StreamableFile> {
        const { stream, filename } = await this.service.getCompiledPdfStream(
            id,
            req.user.sub,
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}"`,
        );
        return stream;
    }

    /** DELETE /resumes/:id */
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthRequest,
    ) {
        return this.service.remove(id, req.user.sub);
    }
}
