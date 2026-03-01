import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateStudentDetails1740788745000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
