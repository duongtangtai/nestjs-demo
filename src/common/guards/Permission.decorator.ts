import { ALLOW_UNAUTHORIZED_REQUEST, PERMISSION_KEY } from "src/utils/constants";
import { PermissionKey } from "./Permission.key";
import { SetMetadata } from "@nestjs/common";

export const RequiredPermissions = (...permissions: PermissionKey[]) => SetMetadata(PERMISSION_KEY, permissions)

export const AllowUnauthorizedRequest = () => SetMetadata(ALLOW_UNAUTHORIZED_REQUEST, true);