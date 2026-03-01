import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'student_details' })
export class StudentDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    /** Stored as a bcrypt hash — never plain text. */
    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    branch: string;

    @Column({ type: 'varchar', length: 255 })
    college: string;

    /** File path or cloud URL to the most recently uploaded resume. */
    @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    resume: string | null;

    /** Running count of all resumes the student has uploaded. */
    @Column({ type: 'int', unsigned: true, default: 0, name: 'number_of_resumes' })
    numberOfResumes: number;

    /** AI credits available for AI-powered features. */
    @Column({ type: 'int', unsigned: true, default: 0, name: 'ai_credit' })
    aiCredit: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
