import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
    constructor(private readonly service: TemplatesService) { }

    /** GET /templates/prebuilt  — all built-in templates */
    @Get('prebuilt')
    getPrebuilt() {
        return this.service.findAllPrebuilt();
    }

    /** GET /templates/mine  — user's own uploaded templates */
    @Get('mine')
    getMine(@Request() req: { user: { sub: number } }) {
        return this.service.findByStudent(req.user.sub);
    }

    /** GET /templates/:id */
    @Get(':id')
    getOne(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: { sub: number } },
    ) {
        return this.service.findOne(id, req.user.sub);
    }

    /**
     * POST /templates/upload
     * Multipart: file + JSON body { name, description? }
     */
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads/templates',
                filename: (_req, file, cb) =>
                    cb(null, `${uuid()}${extname(file.originalname)}`),
            }),
            limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
        }),
    )
    uploadTemplate(
        @Request() req: { user: { sub: number } },
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateTemplateDto,
    ) {
        return this.service.handleUpload(req.user.sub, file, dto);
    }

    /** DELETE /templates/:id */
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: { sub: number } },
    ) {
        return this.service.remove(id, req.user.sub);
    }
}
