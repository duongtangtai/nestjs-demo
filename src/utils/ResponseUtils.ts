import { formatDate } from "src/utils/DateFormatted";


export function response(content: object | string, status: number) {
    return {
        content,
        hasErrors: false,
        errors: [],
        statusCode: status,
        timeStamp: formatDate(new Date())
    }
}

export function error(errMsg: string, status: number) {
    return {
        content: null,
        hasErrors: true,
        errors: [errMsg],
        statusCode: status,
        timeStamp: formatDate(new Date())
    }
}