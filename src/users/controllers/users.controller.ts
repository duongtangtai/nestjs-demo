import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UUID } from 'crypto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { CreateInfoPipe } from 'src/common/pipes/transform-pipes/CreateInfoPipe';
import { UpdateInfoPipe } from 'src/common/pipes/transform-pipes/UpdateInfoPipe';
import { AddUserRolesDto } from '../dtos/AddUserRoles.dto';
import { RequiredPermissions } from 'src/common/guards/Permission.decorator';
import { PermissionKey } from 'src/common/guards/Permission.key';
import { ChangePasswordDto } from '../dtos/ChangePassword.dto';

@Controller("users")
@UsePipes(ValidationPipe)
export class UsersController {
    constructor(
        private usersService: UsersService) {
    }

    @Get()
    @RequiredPermissions(PermissionKey.READ_USER)
    getUsers(@Query("username") username: string, @Query("email") email: string) {
        return this.usersService.getUsers(username, email);
    }

    @Get(":id")
    @RequiredPermissions(PermissionKey.READ_USER)
    getUserById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.usersService.getUserById(id)
    }

    @Post()
    @RequiredPermissions(PermissionKey.CREATE_USER)
    createUser(@Body(CreateInfoPipe) userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @Put(":id")
    @RequiredPermissions(PermissionKey.UPDATE_USER)
    updateUser(@Param("id", ParseUUIDPipe) id: UUID, @Body(UpdateInfoPipe) userDto: UpdateUserDto) {
        return this.usersService.updateUser(id, userDto)
    }

    @Delete(":id")
    @RequiredPermissions(PermissionKey.DELETE_USER)
    deleteUserById(@Param("id", ParseUUIDPipe) id: UUID) {
        return this.usersService.deleteUserById(id)
    }

    @Post("/add-roles")
    @RequiredPermissions(PermissionKey.UPDATE_USER)
    addRolesToUser(@Body(UpdateInfoPipe) addUserRolesDto: AddUserRolesDto) {
        return this.usersService.addRolesToUser(addUserRolesDto);
    }

    @Post("change-password")
    changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.usersService.changePassword(changePasswordDto);
    }
}
