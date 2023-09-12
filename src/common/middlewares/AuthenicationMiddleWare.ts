import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { RequestService } from "../services/Request.service";
import { verifyToken } from "src/utils/JWTUtils";
import { JwtService } from "@nestjs/jwt/dist"

@Injectable()
export class AuthenicationMiddleWare implements NestMiddleware {
    constructor(
        private requestService: RequestService,
        private jwtService: JwtService
    ) { }

    private readonly logger = new Logger(AuthenicationMiddleWare.name)

    async use(req: Request, res: Response, next: (error?: any) => void) {
        this.logger.debug("Middleware checking token.....")
        console.log(req.headers)
        const { authorization } = req.headers;
        if (!authorization) {
            throw new UnauthorizedException();
        }
        try {
            if (authorization === "Bearer") {
                throw new HttpException("No token found", HttpStatus.UNAUTHORIZED)
            }
            const token = authorization.split(" ")[1];
            const { id, username, email } = await verifyToken(this.jwtService, token)
            this.requestService.setUserData({ id, username, email })
        } catch (e) {
            throw new HttpException(e, HttpStatus.UNAUTHORIZED)
        }
        this.logger.debug(this.requestService.getUserData())
        req.next()
    }
}