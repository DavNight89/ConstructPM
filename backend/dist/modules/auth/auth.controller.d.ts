import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(loginDto: LoginDto): Promise<{
        requiresMfa: boolean;
        message: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: any;
        requiresMfa?: undefined;
        message?: undefined;
    }>;
    enableMfa(req: any): Promise<{
        secret: string;
        qrCode: string | undefined;
    }>;
    verifyMfa(req: any, body: {
        token: string;
    }): Promise<{
        message: string;
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(req: any): Promise<any>;
}
