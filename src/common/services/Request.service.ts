import { Scope } from "@nestjs/common"
import { Injectable } from "@nestjs/common/decorators/core"
import { UUID } from "crypto"
import { OnModuleInit } from "@nestjs/common/interfaces"


@Injectable({ scope: Scope.REQUEST })
export class RequestService {
    private userData: UserData

    getUserData() {
        return this.userData
    }

    setUserData(userData: UserData) {
        this.userData = userData
    }
}

type UserData = {
    id: UUID,
    username: string,
    email: string,
}