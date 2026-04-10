import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { StudentDetail } from '../../students/entities/student-detail.entity';
import { Template } from '../../templates/entities/template.entity';

export interface ResumeProjectFile {
    id: string;
    name: string;
    language: 'latex' | 'bib' | 'markdown';
    content: string;
}

export enum ResumeStatus {
    DRAFT = 'draft',
    COMPILED = 'compiled',
    ERROR = 'error',
}

@Entity({ name: 'resumes' })
export class Resume {
    @PrimaryGeneratedColumn()
    id: number;

    /** Display title for the resume (user-editable) */
    @Column({ type: 'varchar', length: 255 })
    title: string;

    /** Current LaTeX source — updated in the editor */
    @Column({ type: 'longtext', nullable: true, default: null })
    latexSource: string | null;

    /**
     * JSON blob of field values the user has filled in.
     * Keyed by the template's placeholder keys.
     */
    @Column({ type: 'json', nullable: true, default: null })
    fieldValues: Record<string, string> | null;

    /** Optional multi-file project workspace used by the Overleaf-style editor. */
    @Column({ type: 'json', nullable: true, default: null, name: 'project_files' })
    projectFiles: ResumeProjectFile[] | null;

    /** Path to the last successfully compiled PDF */
    @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    compiledPdfPath: string | null;

    /** ATS compatibility score (0-100) — set by AI analysis step */
    @Column({ type: 'tinyint', unsigned: true, default: 0, name: 'ats_score' })
    atsScore: number;

    @Column({
        type: 'enum',
        enum: ResumeStatus,
        default: ResumeStatus.DRAFT,
    })
    status: ResumeStatus;

    /** Compiler error message (if status = 'error') */
    @Column({ type: 'text', nullable: true, default: null })
    compileError: string | null;

    @ManyToOne(() => StudentDetail, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: StudentDetail;

    @Column({ name: 'student_id' })
    studentId: number;

    @ManyToOne(() => Template, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'template_id' })
    template: Template | null;

    @Column({ nullable: true, name: 'template_id' })
    templateId: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
