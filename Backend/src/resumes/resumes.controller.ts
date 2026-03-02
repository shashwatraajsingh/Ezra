import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
    constructor(private readonly service: ResumesService) { }

    /** GET /resumes  — list all user's resumes */
    @Get()
    list(@Request() req: { user: { sub: number } }) {
        return this.service.list(req.user.sub);
    }

    /** GET /resumes/:id */
    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: { sub: number } },
    ) {
        return this.service.findOne(id, req.user.sub);
    }

    /** POST /resumes  — create a new resume (optionally from a template) */
    @Post()
    create(
        @Request() req: { user: { sub: number } },
        @Body() dto: CreateResumeDto,
    ) {
        return this.service.create(req.user.sub, dto);
    }

    /** PATCH /resumes/:id  — update LaTeX or field values */
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: { sub: number } },
        @Body() dto: UpdateResumeDto,
    ) {
        return this.service.update(id, req.user.sub, dto);
    }

    /** POST /resumes/:id/compile  — trigger server-side pdflatex */
    @Post(':id/compile')
    compile(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: { sub: number } },
    ) {
        return this.service.compile(id, req.user.sub);
    }

    /** DELETE /resumes/:id */
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: { sub: number } },
    ) {
        return this.service.remove(id, req.user.sub);
    }
}
