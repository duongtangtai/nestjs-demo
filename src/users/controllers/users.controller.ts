import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UUID } from 'crypto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';

@Controller("users")
@UsePipes(ValidationPipe)
export class UsersController {
    constructor(
        private usersService: UsersService) {
    }

    @Get()
    getUsers(@Query("username") username: string, @Query("email") email: string) {
        return this.usersService.getUsers(username, email);
    }

    @Get(":id")
    getUserById(@Param("id", ParseUUIDPipe) id: UUID) {
        console.log("getbyid")
        return this.usersService.getUserById(id)
    }

    @Post()
    createUser(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @Put(":id")
    updateUser(@Param("id", ParseUUIDPipe) id: UUID, @Body() userDto: UpdateUserDto) {
        return this.usersService.updateUser(id, userDto)
    }

    @Delete(":id")
    deleteUserById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.usersService.deleteUserById(id)
    }
}
