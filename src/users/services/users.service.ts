import { HttpException, HttpStatus, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "src/common/entities/User.entity";
import { error, response } from "src/utils/ResponseUtils";
import { UUID } from "crypto";
import * as bcrypt from "bcrypt";
import { formatDate } from "src/utils/DateFormatted";

@Injectable()
export class UsersService {
    private logger = new Logger(UsersService.name)

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async getUsers(username: string, email: string) {
        console.log("username: ", username)
        console.log("email: ", email)
        const users: User[] = await this.userRepository.query(`
            SELECT * 
            FROM USERS
            WHERE USERNAME LIKE '${username}%'
            AND EMAIL LIKE '${email}%'
        `)
        console.log("RAWDATA=>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(users)
        try {
            this.logger.debug("getUsers")
            return response(users.map(user => {
                console.log(user)
                const { id, username, email, updated_at, updated_by } = user;
                return { id, username, email, updated_at: formatDate(updated_at), updated_by};
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
            console.log(createUserParams)
            //validation 
            const oldUser: User = await this.userRepository.findOneBy({ email: createUserParams.email })
            if (oldUser) {
                return error("Email already exists", HttpStatus.BAD_REQUEST);
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
            const user: User = await this.userRepository.findOneBy({ id: inputId })
            if (!user) {
                return error("User not found", HttpStatus.BAD_REQUEST)
            }
            const { id, username, email }: User =
                await this.userRepository.save({
                    ...user,
                    ...updateUserParams,
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
            await this.userRepository.delete(inputId)
            return response("Deleted user successfuly!", HttpStatus.OK)
        } catch (e) {
            this.logger.error(e)
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}