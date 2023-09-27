import { HttpException, HttpStatus, Injectable, Logger, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { RequestService } from "../services/Request.service";
import { verifyToken } from "src/utils/JWTUtils";
import { JwtService } from "@nestjs/jwt/dist"
import { RolesService } from "src/roles/services/Roles.service";

@Injectable()
export class AuthenicationMiddleWare implements NestMiddleware {
    constructor(
        private readonly requestService: RequestService,
        private readonly jwtService: JwtService,
        private readonly rolesService: RolesService
    ) { }

    private readonly logger = new Logger(AuthenicationMiddleWare.name)

    async use(req: Request, res: Response, next: (error?: any) => void) {
        this.logger.debug("Middleware checking token..... for path: ", req.originalUrl)
        const { authorization } = req.headers;
        if (!authorization) {
            throw new UnauthorizedException();
        }
        try {
            if (authorization === "Bearer") {
                throw new HttpException("No token found", HttpStatus.UNAUTHORIZED)
            }
            const token = authorization.split(" ")[1];
            const { id, username, email, roles } = await verifyToken(this.jwtService, token)
            console.log("roles found: ")
            console.log(roles)
            //check if roles includes 'ADM' => admin
            const isAdmin = roles.includes("ADM");
            const permissions = await this.rolesService.getPermissionsByRoleNames(roles);
            console.log("permissions found:")
            console.log(permissions)
            this.requestService.setUserData({ id, username, email, isAdmin, permissions})
        } catch (e) {
            throw new HttpException(e, HttpStatus.UNAUTHORIZED)
        }
        this.logger.debug(this.requestService.getUserData())
        req.next()
    }
}