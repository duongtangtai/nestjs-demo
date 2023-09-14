import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        try {
            const user: User = await this.userRepository.findOneBy({ email: loginDto.email })
            if (!user) {
                return error("Email or password is not correct", HttpStatus.BAD_REQUEST)
            }

            const isMatch = await bcrypt.compare(loginDto.password, user.password);
            if (!isMatch) {
                return error("Email or password is not correct", HttpStatus.BAD_REQUEST)
            }

            const { id, username, email } = user
            const access_token = await generateAccessToken(this.jwtService, { id, username, email });
            const refresh_token = await generateRefreshToken(this.jwtService, { id, username, email });
            return response({ id, username, email, access_token, refresh_token }, HttpStatus.OK)
        } catch (e) {
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
        }
    }

    async register(registerDto: RegisterDto) {
        try {
            //validation 
            const emailMatch: User = await this.userRepository.findOneBy({ email: registerDto.email })
            const usernameMatch: User = await this.userRepository.findOneBy({ username: registerDto.username })
            if (emailMatch) {
                return error("Email already exists", HttpStatus.BAD_REQUEST);
            }
            if (usernameMatch) {
                return error("Username already exists", HttpStatus.BAD_REQUEST);
            }
            const salt = await bcrypt.genSalt()
            const hash = await bcrypt.hash(registerDto.password, salt)
            const userInfo: User = this.userRepository.create({ ...registerDto, password: hash })
            const { id, username, email }: User = await this.userRepository.save({
                ...userInfo,
                createdBy: userInfo.username,
                updatedBy: userInfo.username,
            });
            return response({ id, username, email }, HttpStatus.CREATED);
        } catch (e) {
            throw new HttpException(e.detail, HttpStatus.BAD_REQUEST)
        }

    }

    async refreshToken(accessToken: string) {
        try {
            const { id, username, email } = await verifyToken(this.jwtService, accessToken)
            if (!id || !username || !email) {
                return error("Invalid user info", HttpStatus.UNAUTHORIZED)
            }
            const access_token = await generateAccessToken(this.jwtService, { id, username, email })
            const refresh_token = await generateRefreshToken(this.jwtService, { id, username, email })
            return response({ access_token, refresh_token }, HttpStatus.OK)
        } catch (e) {
            throw new HttpException(e, HttpStatus.UNAUTHORIZED)
        }
    }
}