import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: CreateStudentDetails
 *
 * Creates the `student_details` table — the core profile table for every student
 * registered on the Ezra AI Resume Platform.
 *
 * Columns
 * ───────
 *  id                – Auto-increment primary key
 *  name              – Student's full name
 *  email             – Unique login identifier (gmail or any valid e-mail)
 *  password          – argon2id-hashed credential (never plain text)
 *  branch            – Academic branch / field of study
 *  college           – Name of the student's college / university
 *  resume            – Path or URL to the latest uploaded resume (nullable)
 *  number_of_resumes – Running count of all uploaded resumes
 *  ai_credit         – AI credits available for AI-powered features
 *  created_at        – Row creation timestamp
 *  updated_at        – Row last-update timestamp (auto-refreshed by DB)
 */
export class CreateStudentDetails1740788745000 implements MigrationInterface {
    name = 'CreateStudentDetails1740788745000';

    // ─── UP ────────────────────────────────────────────────────────────────────

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`student_details\` (
                \`id\`                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
                \`name\`                VARCHAR(255)    NOT NULL,
                \`email\`               VARCHAR(255)    NOT NULL,
                \`password\`            VARCHAR(255)    NOT NULL,
                \`branch\`              VARCHAR(255)    NOT NULL,
                \`college\`             VARCHAR(255)    NOT NULL,
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

    // ─── DOWN ──────────────────────────────────────────────────────────────────

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`student_details\``);
    }
}
