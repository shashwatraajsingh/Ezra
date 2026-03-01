import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { StudentDetail } from '../students/entities/student-detail.entity';

/**
 * Standalone DataSource used exclusively by the TypeORM CLI
 * (migration:run, migration:generate, migration:revert, etc.).
 *
 * The app itself gets its connection via AppModule → TypeOrmModule.forRootAsync().
 */
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'secret',
    database: process.env.DB_NAME ?? 'ezra_db',
    entities: [StudentDetail],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
});
