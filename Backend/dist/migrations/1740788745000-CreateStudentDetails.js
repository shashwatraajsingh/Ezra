"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStudentDetails1740788745000 = void 0;
class CreateStudentDetails1740788745000 {
    name = 'CreateStudentDetails1740788745000';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`student_details\` (
                \`id\`                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
                \`name\`                VARCHAR(255)    NOT NULL,
                \`email\`               VARCHAR(255)    NOT NULL,
                \`password\`            VARCHAR(255)    NOT NULL,
                \`resume\`              VARCHAR(500)    NULL        DEFAULT NULL
                                        COMMENT 'File path or cloud URL to the uploaded resume',
                \`number_of_resumes\`   INT UNSIGNED    NOT NULL    DEFAULT 0
                                        COMMENT 'Running total of resumes uploaded by this student',
                \`ai_credit\`           INT UNSIGNED    NOT NULL    DEFAULT 0
                                        COMMENT 'AI credits available for AI-powered features',
                \`created_at\`          DATETIME(6)     NOT NULL    DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\`          DATETIME(6)     NOT NULL    DEFAULT CURRENT_TIMESTAMP(6)
                                        ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                UNIQUE INDEX \`UQ_student_details_email\` (\`email\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS \`student_details\``);
    }
}
exports.CreateStudentDetails1740788745000 = CreateStudentDetails1740788745000;
//# sourceMappingURL=1740788745000-CreateStudentDetails.js.map