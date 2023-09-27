import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from "@nestjs/core"
import { PermissionKey } from './Permission.key';
import { ALLOW_UNAUTHORIZED_REQUEST, PERMISSION_KEY } from 'src/utils/constants';
import { RequestService } from '../services/Request.service';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly requestService: RequestService,
        ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        this.logger.debug("GUARDING!!!!!!!!!!!!!!!!!!!!")
        const allowUnauthorizedRequest = this.reflector.getAllAndOverride<PermissionKey[]>(ALLOW_UNAUTHORIZED_REQUEST, [
            context.getHandler(),
            context.getClass()
        ])
        if (allowUnauthorizedRequest) {
            this.logger.debug("ALLOW_UNAUTHORIZED_REQUEST.....")
            return true;
        }

        const requiredPermissions = this.reflector.getAllAndOverride<PermissionKey[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])//get first not undefined. If handler metadata is undefined => get from the class
        if (!requiredPermissions) {
            return true;
        }
        console.log("requiredPermissions: ")
        console.log(requiredPermissions)
        const {isAdmin, permissions} = this.requestService.getUserData();
        console.log("userPermissions")
        console.log(permissions)
        if (isAdmin) {
            console.log("USER IS ADMIN => PASS")
            return true;
        }
        return requiredPermissions.every(required => permissions.includes(required));
        // return true;
    }
}