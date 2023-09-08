import { HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt/dist"

export async function generateAccessToken(jwtService: JwtService, payload: object) {
    return await jwtService.signAsync(payload, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
        secret: process.env.JWT_SECRET
    })
}

export async function generateRefreshToken(jwtService: JwtService, payload: object) {
    return await jwtService.signAsync(payload, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
        secret: process.env.JWT_SECRET
    })
}

export function verifyToken(jwtService: JwtService, token: string) {
    return jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
}