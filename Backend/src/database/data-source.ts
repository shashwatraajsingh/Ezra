import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load .env before anything reads process.env (TypeORM CLI context)
config();
import { StudentDetail } from '../students/entities/student-detail.entity';
import { Template } from '../templates/entities/template.entity';
import { Resume } from '../resumes/entities/resume.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'secret',
    database: process.env.DB_NAME ?? 'ezra_db',
    entities: [StudentDetail, Template, Resume],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
});
