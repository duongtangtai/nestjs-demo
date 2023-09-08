import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "src/common/entities/User.entity";
import { RequestService } from "src/common/services/Request.service";
import { response } from "src/utils/ResponseUtils";
import { UUID } from "crypto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private requestService: RequestService
    ) { }

    async getUsers() {
        return response((await this.userRepository.find()).map(user => {
            const { id, username, email } = user;
            return { id, username, email };
        }), HttpStatus.OK);
    }

    async getUserById(inputId: UUID) {
        const user = await this.userRepository.findOneBy({ id: inputId })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        const { id, username, email } = user;
        return response({ id, username, email }, HttpStatus.OK);
    }

    async createUser(createUserParams: CreateUserParams) {
        //validation 
        const oldUser: User = await this.userRepository.findOneBy({ email: createUserParams.email })
        if (oldUser) {
            throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
        }
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(createUserParams.password, salt)

        const userInfo: User = this.userRepository.create({ ...createUserParams, password: hash})
        const { id, username, email }: User = await this.userRepository.save(userInfo);
        return response({ id, username, email }, HttpStatus.CREATED);
    }

    async updateUser(inputId: UUID, updateUserParams: UpdateUserParams) {
        const user = await this.userRepository.findOneBy({ id: inputId })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        const { id, username, email }: User = await this.userRepository.save({ ...user, ...updateUserParams })
        return response({ id, username, email }, HttpStatus.OK);
    }

    async deleteUserById(inputId: UUID) {
        const user = await this.userRepository.findOneBy({ id: inputId })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        await this.userRepository.delete(inputId)
        return response(`Deleted user with id ${inputId}`, HttpStatus.OK)
    }
}