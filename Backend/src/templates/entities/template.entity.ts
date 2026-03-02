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

export enum TemplateKind {
    PREBUILT = 'prebuilt',
    USER_UPLOADED = 'user_uploaded',
}

@Entity({ name: 'templates' })
export class Template {
    @PrimaryGeneratedColumn()
    id: number;

    /** Human-readable name shown in the gallery */
    @Column({ type: 'varchar', length: 255 })
    name: string;

    /** Optional longer description / category tag */
    @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    description: string | null;

    /** 'prebuilt' = shipped with the app; 'user_uploaded' = user-provided */
    @Column({
        type: 'enum',
        enum: TemplateKind,
        default: TemplateKind.PREBUILT,
    })
    kind: TemplateKind;

    /**
     * For prebuilt: thumbnail image path relative to /public.
     * For user_uploaded: path/URL of the original file (PDF/DOCX).
     */
    @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    fileRef: string | null;

    /** Final LaTeX source — populated by AI pipeline for uploaded templates */
    @Column({ type: 'longtext', nullable: true, default: null })
    latexSource: string | null;

    /**
     * JSON blob of placeholder keys extracted from the LaTeX.
     * e.g. ["{{name}}", "{{email}}", "{{experience}}"]
     */
    @Column({ type: 'json', nullable: true, default: null })
    placeholders: string[] | null;

    /** Null for prebuilt templates; set for user-uploaded ones */
    @ManyToOne(() => StudentDetail, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: StudentDetail | null;

    @Column({ nullable: true, name: 'student_id' })
    studentId: number | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
