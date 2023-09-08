import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/entities/User.entity";
import { Repository } from "typeorm";
import { LoginDto } from "../dtos/LoginDto";
import * as bcrypt from "bcrypt"
import { error, response } from "src/utils/ResponseUtils";
import { JwtService } from "@nestjs/jwt";
import { generateAccessToken, generateRefreshToken, verifyToken } from "src/utils/JWTUtils";
import 'dotenv/config'
import { RegisterDto } from "../dtos/RegisterDto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto) {
        const user: User = await this.userRepository.findOneBy({ email: loginDto.email })
        if (!user) {
            return response("Email or password is not correct", HttpStatus.BAD_REQUEST)
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            return response("Email or password is not correct", HttpStatus.BAD_REQUEST)
        }

        const { id, username, email } = user
        const access_token = await generateAccessToken(this.jwtService, { id, username, email });
        const refresh_token = await generateRefreshToken(this.jwtService, { id, username, email });
        return response({ id, username, email, access_token, refresh_token }, HttpStatus.OK)
    }

    async register(registerDto: RegisterDto) {
        //validation 
        const oldUser: User = await this.userRepository.findOneBy({ email: registerDto.email })
        if (oldUser) {
            throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
        }
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(registerDto.password, salt)

        const userInfo: User = this.userRepository.create({ ...registerDto, password: hash })
        const { id, username, email }: User = await this.userRepository.save(userInfo);
        return response({ id, username, email }, HttpStatus.CREATED);
    }

    async refreshToken(accessToken: string) {
        try {
            const {id, username, email} = await verifyToken(this.jwtService, accessToken)
            if (!id || !username || !email) {
                return error("Invalid user info", HttpStatus.UNAUTHORIZED)
            }
            const access_token = await generateAccessToken(this.jwtService, {id, username, email})
            const refresh_token = await generateRefreshToken(this.jwtService, {id, username, email})
            return response({ access_token, refresh_token}, HttpStatus.OK)
        } catch (e) {
            throw new HttpException(e, HttpStatus.UNAUTHORIZED)
        }
    }
}