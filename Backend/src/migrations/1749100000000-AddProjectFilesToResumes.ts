import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectFilesToResumes1749100000000 implements MigrationInterface {
    name = 'AddProjectFilesToResumes1749100000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`resumes\`
            ADD COLUMN \`project_files\` JSON NULL DEFAULT NULL
            AFTER \`field_values\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`resumes\`
            DROP COLUMN \`project_files\`
        `);
    }
}
