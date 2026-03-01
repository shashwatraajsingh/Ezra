"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const student_detail_entity_1 = require("../students/entities/student-detail.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'secret',
    database: process.env.DB_NAME ?? 'ezra_db',
    entities: [student_detail_entity_1.StudentDetail],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
});
//# sourceMappingURL=data-source.js.map