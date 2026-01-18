"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const speakeasy = __importStar(require("speakeasy"));
const user_entity_1 = require("../../database/entities/user.entity");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, role } = registerDto;
        const existingUser = await this.usersRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('User already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            passwordHash,
            firstName,
            lastName,
            role,
        });
        await this.usersRepository.save(user);
        const tokens = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(loginDto) {
        const { email, password, mfaToken } = loginDto;
        const user = await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'passwordHash', 'role', 'status', 'mfaEnabled', 'mfaSecret'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.mfaEnabled) {
            if (!mfaToken) {
                return {
                    requiresMfa: true,
                    message: 'MFA token required',
                };
            }
            const isValidToken = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: mfaToken,
                window: 2,
            });
            if (!isValidToken) {
                throw new common_1.UnauthorizedException('Invalid MFA token');
            }
        }
        const tokens = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async enableMfa(userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const secret = speakeasy.generateSecret({
            name: `ConstructPM (${user.email})`,
            issuer: 'ConstructPM',
        });
        user.mfaSecret = secret.base32;
        await this.usersRepository.save(user);
        return {
            secret: secret.base32,
            qrCode: secret.otpauth_url,
        };
    }
    async verifyAndEnableMfa(userId, token) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['id', 'mfaSecret'],
        });
        if (!user || !user.mfaSecret) {
            throw new common_1.UnauthorizedException('MFA setup not initiated');
        }
        const isValid = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: token,
            window: 2,
        });
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid MFA token');
        }
        user.mfaEnabled = true;
        await this.usersRepository.save(user);
        return { message: 'MFA enabled successfully' };
    }
    async refreshToken(userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.generateTokens(user);
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '15m' }),
            this.jwtService.signAsync(payload, { expiresIn: '7d' }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    sanitizeUser(user) {
        const { passwordHash, mfaSecret, ...sanitized } = user;
        return sanitized;
    }
    async validateUser(userId) {
        return this.usersRepository.findOne({ where: { id: userId } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map