"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDetail = void 0;
const typeorm_1 = require("typeorm");
let StudentDetail = class StudentDetail {
    id;
    name;
    email;
    password;
    resume;
    numberOfResumes;
    aiCredit;
    createdAt;
    updatedAt;
};
exports.StudentDetail = StudentDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StudentDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], StudentDetail.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], StudentDetail.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], StudentDetail.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, default: null }),
    __metadata("design:type", Object)
], StudentDetail.prototype, "resume", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0, name: 'number_of_resumes' }),
    __metadata("design:type", Number)
], StudentDetail.prototype, "numberOfResumes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0, name: 'ai_credit' }),
    __metadata("design:type", Number)
], StudentDetail.prototype, "aiCredit", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StudentDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StudentDetail.prototype, "updatedAt", void 0);
exports.StudentDetail = StudentDetail = __decorate([
    (0, typeorm_1.Entity)({ name: 'student_details' })
], StudentDetail);
//# sourceMappingURL=student-detail.entity.js.map