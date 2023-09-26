import { Catch, HttpException, ExceptionFilter, ArgumentsHost, Logger } from "@nestjs/common"
import { Response } from "express"
import { error } from "src/utils/ResponseUtils"
import { QueryFailedError } from "typeorm"

@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name)

    catch(exception: any, host: ArgumentsHost) {
        this.logger.debug("HttpExceptionFilter filter....")
        const response: Response = host.switchToHttp().getResponse<Response>()
        switch (exception.name) {
            case "BadRequestException":
                response.status(exception.getStatus())
                    .send(error(exception.getResponse().valueOf().message, exception.getStatus()))
                break
            default:
                response.status(exception.getStatus())
                    .send(error(exception.message, exception.getStatus()))
        }
    }
}