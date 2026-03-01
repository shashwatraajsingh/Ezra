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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const student_detail_entity_1 = require("../students/entities/student-detail.entity");
const BCRYPT_SALT_ROUNDS = 12;
let AuthService = class AuthService {
    studentRepo;
    jwtService;
    constructor(studentRepo, jwtService) {
        this.studentRepo = studentRepo;
        this.jwtService = jwtService;
    }
    async signUp(dto) {
        const exists = await this.studentRepo.findOne({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
        const student = this.studentRepo.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            branch: dto.branch,
            college: dto.college,
        });
        const saved = await this.studentRepo.save(student).catch(() => {
            throw new common_1.InternalServerErrorException('Could not create account. Please try again.');
        });
        return { accessToken: this.generateToken(saved) };
    }
    async signIn(student) {
        return { accessToken: this.generateToken(student) };
    }
    async validateStudent(email, password) {
        const student = await this.studentRepo
            .createQueryBuilder('s')
            .addSelect('s.password')
            .where('s.email = :email', { email })
            .getOne();
        if (!student)
            return null;
        const passwordMatches = await bcrypt.compare(password, student.password);
        return passwordMatches ? student : null;
    }
    generateToken(student) {
        const payload = { sub: student.id, email: student.email };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_detail_entity_1.StudentDetail)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map