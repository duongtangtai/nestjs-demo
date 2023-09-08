import { HttpStatus } from "@nestjs/common";

export class ResponseDto {
    content: object;
    hasErrors: boolean;
    errors: [];
    statusCode: HttpStatus
    timeStamp: string
}