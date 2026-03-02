import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';
import { ResumesModule } from './resumes/resumes.module';

import { StudentDetail } from './students/entities/student-detail.entity';
import { Template } from './templates/entities/template.entity';
import { Resume } from './resumes/entities/resume.entity';

@Module({
  imports: [
    // ── 1. Config ─────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── 2. Database ───────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'secret'),
        database: config.get<string>('DB_NAME', 'ezra_db'),
        entities: [StudentDetail, Template, Resume],
        migrations: ['dist/migrations/*.js'],
        synchronize: false,
        logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    // ── 3. Feature Modules ────────────────────────────────────────────────
    AuthModule,
    TemplatesModule,
    ResumesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
