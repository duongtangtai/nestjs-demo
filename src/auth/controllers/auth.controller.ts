import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common"
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/Login.dto";
import { RegisterDto } from "../dtos/RegisterDto";
import { AllowUnauthorizedRequest, RequiredPermissions } from "src/common/guards/Permission.decorator";

@Controller("auth")
@UsePipes(ValidationPipe)
@AllowUnauthorizedRequest()
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post("login")
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post("register")
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }

    @Post("refresh-token/:accessToken")
    refreshToken(@Param("accessToken") accessToken: string) {
        return this.authService.refreshToken(accessToken)
    }
}