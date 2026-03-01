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

    /**
     * Store a bcrypt/argon2 hash — never a plain-text password.
     */
    @Column({ type: 'varchar', length: 255 })
    password: string;

    /**
     * File path or cloud URL to the most recently uploaded resume.
     * Nullable until the student uploads one.
     */
    @Column({ type: 'varchar', length: 500, nullable: true, default: null })
    resume: string | null;

    /**
     * Running count of all resumes the student has uploaded.
     */
    @Column({ type: 'int', unsigned: true, default: 0, name: 'number_of_resumes' })
    numberOfResumes: number;

    /**
     * AI credits available to the student for AI-powered features.
     */
    @Column({ type: 'int', unsigned: true, default: 0, name: 'ai_credit' })
    aiCredit: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
