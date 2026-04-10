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
const student_detail_entity_1 = require("../students/entities/student-detail.entity");
const firebase_admin_1 = require("./firebase-admin");
let AuthService = class AuthService {
    studentRepo;
    jwtService;
    constructor(studentRepo, jwtService) {
        this.studentRepo = studentRepo;
        this.jwtService = jwtService;
    }
    async signInWithGoogle(idToken) {
        const decoded = await (0, firebase_admin_1.getFirebaseAdminAuth)().verifyIdToken(idToken).catch((error) => {
            if (error instanceof Error && error.message.includes('Missing Firebase Admin config')) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            throw new common_1.UnauthorizedException('Invalid Firebase ID token');
        });
        if (!decoded.email) {
            throw new common_1.UnauthorizedException('Google account is missing an email address');
        }
        let student = await this.studentRepo.findOne({
            where: { email: decoded.email },
        });
        if (!student) {
            student = this.studentRepo.create({
                name: decoded.name ?? decoded.email.split('@')[0],
                email: decoded.email,
                password: `GOOGLE_AUTH_ONLY:${decoded.uid}`,
                branch: 'Not provided',
                college: 'Not provided',
            });
        }
        else if (decoded.name && student.name !== decoded.name) {
            student.name = decoded.name;
        }
        const saved = await this.studentRepo.save(student).catch(() => {
            throw new common_1.InternalServerErrorException('Could not complete Google sign-in. Please try again.');
        });
        return { accessToken: this.generateToken(saved) };
    }
    generateToken(student) {
        const payload = {
            sub: student.id,
            email: student.email,
            name: student.name,
            branch: student.branch,
            college: student.college,
            aiCredit: student.aiCredit,
            numberOfResumes: student.numberOfResumes,
        };
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