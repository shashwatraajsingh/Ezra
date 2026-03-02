import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTemplatesAndResumes1740960000000
    implements MigrationInterface {
    name = 'CreateTemplatesAndResumes1740960000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── templates ─────────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE \`templates\` (
                \`id\`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
                \`name\`         VARCHAR(255) NOT NULL,
                \`description\`  VARCHAR(500) NULL DEFAULT NULL,
                \`kind\`         ENUM('prebuilt','user_uploaded') NOT NULL DEFAULT 'prebuilt',
                \`file_ref\`     VARCHAR(500) NULL DEFAULT NULL,
                \`latex_source\` LONGTEXT NULL DEFAULT NULL,
                \`placeholders\` JSON NULL DEFAULT NULL,
                \`student_id\`   INT NULL DEFAULT NULL,
                \`created_at\`   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\`   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`fk_templates_student\`
                    FOREIGN KEY (\`student_id\`) REFERENCES \`student_details\` (\`id\`)
                    ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // ── resumes ───────────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE \`resumes\` (
                \`id\`                INT UNSIGNED NOT NULL AUTO_INCREMENT,
                \`title\`            VARCHAR(255) NOT NULL,
                \`latex_source\`     LONGTEXT NULL DEFAULT NULL,
                \`field_values\`     JSON NULL DEFAULT NULL,
                \`compiled_pdf_path\` VARCHAR(500) NULL DEFAULT NULL,
                \`ats_score\`        TINYINT UNSIGNED NOT NULL DEFAULT 0,
                \`status\`           ENUM('draft','compiled','error') NOT NULL DEFAULT 'draft',
                \`compile_error\`    TEXT NULL DEFAULT NULL,
                \`student_id\`       INT UNSIGNED NOT NULL,
                \`template_id\`      INT UNSIGNED NULL DEFAULT NULL,
                \`created_at\`       DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\`       DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`fk_resumes_student\`
                    FOREIGN KEY (\`student_id\`) REFERENCES \`student_details\` (\`id\`)
                    ON DELETE CASCADE,
                CONSTRAINT \`fk_resumes_template\`
                    FOREIGN KEY (\`template_id\`) REFERENCES \`templates\` (\`id\`)
                    ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // ── seed prebuilt templates ───────────────────────────────────────────
        await queryRunner.query(`
            INSERT INTO \`templates\` (\`name\`, \`description\`, \`kind\`, \`file_ref\`, \`placeholders\`, \`latex_source\`) VALUES
            (
                'Classic Professional',
                'Clean single-column template — ideal for ATS',
                'prebuilt',
                '/templates/classic-professional.png',
                '["name","email","phone","summary","experience","education","skills"]',
                '\\\\documentclass[letterpaper,11pt]{article}\\n\\\\usepackage{fullpage,titlesec,enumitem,hyperref}\\n\\\\begin{document}\\n\\\\begin{center}{\\\\Huge {{name}}}\\\\\\\\[4pt]{{email}} $|$ {{phone}}\\\\end{center}\\n\\\\section*{Summary}{{summary}}\\n\\\\section*{Experience}{{experience}}\\n\\\\section*{Education}{{education}}\\n\\\\section*{Skills}{{skills}}\\n\\\\end{document}'
            ),
            (
                'Modern Two-Column',
                'Side-by-side layout with skills sidebar — great for tech roles',
                'prebuilt',
                '/templates/modern-two-column.png',
                '["name","email","phone","summary","experience","education","skills","projects"]',
                '\\\\documentclass[letterpaper,10pt]{article}\\n\\\\usepackage{fullpage,multicol,titlesec,enumitem,hyperref}\\n\\\\begin{document}\\n{\\\\Large\\\\bfseries{{name}}}\\\\hfill{{email}} $|$ {{phone}}\\n\\\\begin{multicols}{2}\\n\\\\section*{Summary}{{summary}}\\n\\\\columnbreak\\n\\\\section*{Skills}{{skills}}\\n\\\\end{multicols}\\n\\\\section*{Experience}{{experience}}\\n\\\\section*{Projects}{{projects}}\\n\\\\section*{Education}{{education}}\\n\\\\end{document}'
            ),
            (
                'Minimal Academic',
                'Understated academic CV — perfect for research positions',
                'prebuilt',
                '/templates/minimal-academic.png',
                '["name","email","phone","institution","thesis","publications","awards","education"]',
                '\\\\documentclass[a4paper,12pt]{article}\\n\\\\usepackage{geometry,titlesec,enumitem,hyperref}\\n\\\\geometry{margin=1in}\\n\\\\begin{document}\\n\\\\begin{center}{\\\\LARGE {{name}}}\\\\\\\\[6pt]{{email}} $\\\\cdot$ {{phone}}\\\\end{center}\\n\\\\section*{Education}{{education}}\\n\\\\section*{Thesis}{{thesis}}\\n\\\\section*{Publications}{{publications}}\\n\\\\section*{Awards}{{awards}}\\n\\\\end{document}'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`resumes\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`templates\``);
    }
}
