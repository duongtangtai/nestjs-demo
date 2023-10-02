import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class ChangePasswordDto {
    @IsUUID()
    userId: UUID;

    @IsNotEmpty()
    currentPassword: string;

    @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    confirmNewPassword: string;
}