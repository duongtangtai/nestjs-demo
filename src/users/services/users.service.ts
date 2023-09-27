import { HttpException, HttpStatus, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { In, Like, Not, Repository } from "typeorm"
import { User } from "src/common/entities/User.entity";
import { error, response } from "src/utils/ResponseUtils";
import { UUID } from "crypto";
import * as bcrypt from "bcrypt";
import { formatDate } from "src/utils/DateFormatted";
import { Role } from "src/common/entities/Role.entity";
import { RequestService } from "src/common/services/Request.service";

@Injectable()
export class UsersService {
    private logger = new Logger(UsersService.name)

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        private requestService: RequestService
    ) { }

    async getUsers(username: string, email: string) {
        const users = await this.userRepository.find({
            where: {
                ...(username && { username: Like(`${username}%`) }),
                ...(email && { email: Like(`${email}%`) }),
            },
            relations: ["roles"]
        })
        try {
            this.logger.debug("getUsers")
            return response(users.map(user => {
                const { id, username, email, updated_at, updated_by, roles } = user;
                return { id, username, email, updated_at: formatDate(updated_at), updated_by, roles: roles.map(role => role.name).toString() };
            }), HttpStatus.OK);
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async getUserById(inputId: UUID) {
        try {
            this.logger.debug("getUserById")
            const user: User = await this.userRepository.findOneBy({ id: inputId })
            if (!user) {
                return error("User not found", HttpStatus.BAD_REQUEST)
            }
            const { id, username, email } = user;
            return response({ id, username, email }, HttpStatus.OK);
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async createUser(createUserParams: CreateUserParams) {
        try {
            this.logger.debug("createUser")
            //validation 
            let oldUser: User = await this.userRepository.findOneBy({ email: createUserParams.email })
            if (oldUser) {
                return error("Email already exists", HttpStatus.BAD_REQUEST);
            }
            oldUser = await this.userRepository.findOneBy({ username: createUserParams.username })
            if (oldUser) {
                return error("Username already exists", HttpStatus.BAD_REQUEST);
            }
            const salt = await bcrypt.genSalt()
            const hash = await bcrypt.hash(createUserParams.password, salt)

            const userInfo: User = this.userRepository.create({
                ...createUserParams,
                password: hash,
            })
            const { id, username, email }: User = await this.userRepository.save(userInfo);
            return response({ id, username, email }, HttpStatus.CREATED);
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async updateUser(inputId: UUID, updateUserParams: UpdateUserParams) {
        try {
            this.logger.debug("updateUser")
            const {password, ...updateParams} = updateUserParams
            const user: User = await this.userRepository.findOneBy({ id: inputId })
            if (!user) {
                return error("User not found", HttpStatus.BAD_REQUEST)
            }
            //validation
            let isDuplicated : User = await this.userRepository.findOneBy({email: updateParams.email, id : Not(user.id)})
            if (isDuplicated) {
                return error("Email already exists", HttpStatus.BAD_REQUEST)
            }
            isDuplicated = await this.userRepository.findOneBy({username: updateParams.username, id : Not(user.id)})
            if (isDuplicated) {
                return error("Username already exists", HttpStatus.BAD_REQUEST)
            }
            let hash: string = null;
            if (updateUserParams.password !== "") {
                const salt = await bcrypt.genSalt()
                hash = await bcrypt.hash(password, salt)
            }
            const { id, username, email }: User =
                await this.userRepository.save({
                    ...user,
                    ...updateParams,
                    ...(hash && {password: hash})
                })
            return response({ id, username, email }, HttpStatus.OK);
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async deleteUserById(inputId: UUID) {
        try {
            this.logger.debug("deleteUserById")
            const user: User = await this.userRepository.findOneBy({ id: inputId })
            if (!user) {
                return error("User not found", HttpStatus.BAD_REQUEST)
            }
            user.roles = [];
            await this.userRepository.save(user)
            await this.userRepository.delete(inputId)
            return response("Deleted user successfuly!", HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }

    async addRolesToUser(addUserRolesParams: AddUserRolesParams) {
        //find user
        const user = await this.userRepository.findOne({ where: { id: addUserRolesParams.userId }, relations: ["roles"] });
        if (!user) {
            return error("User not found", HttpStatus.BAD_REQUEST)
        }
        //find roles
        const roles = await this.roleRepository.find({ where: { name: In([...addUserRolesParams.roleNames]) } })
        user.roles = roles;
        const { password, ...savedUser }: User = await this.userRepository.save({
            ...user,
            updated_by:  this.requestService.getUserData().username,
            updated_at: formatDate(new Date())
        })
        return response(savedUser, HttpStatus.OK)
    }
}