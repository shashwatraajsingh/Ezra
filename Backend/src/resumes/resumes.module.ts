import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Resume } from './entities/resume.entity';
import { Template } from '../templates/entities/template.entity';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Resume, Template])],
    controllers: [ResumesController],
    providers: [ResumesService],
    exports: [ResumesService],
})
export class ResumesModule { }
