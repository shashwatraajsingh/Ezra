import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Template } from './entities/template.entity';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Template]),
        MulterModule.register({ dest: './public/uploads/templates' }),
    ],
    controllers: [TemplatesController],
    providers: [TemplatesService],
    exports: [TemplatesService],
})
export class TemplatesModule { }
