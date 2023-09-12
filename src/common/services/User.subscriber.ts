// import { Connection, DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
// import { BaseEntity } from "../entities/Base.entity";
// import { RequestService } from "./Request.service";
// import { HttpException, HttpStatus, Injectable, OnModuleInit, Scope } from "@nestjs/common"
// import { InjectConnection, InjectDataSource } from "@nestjs/typeorm";
// import { User } from "../entities/User.entity";
// import { ModuleRef, REQUEST, ContextIdFactory } from "@nestjs/core"
// import { Inject } from "@nestjs/common/decorators";
// import { Request } from "express";



// // @Injectable({scope: Scope.REQUEST})
// @EventSubscriber()
// // @InjectedEventSubscriber()
// export class UserSubscriber implements EntitySubscriberInterface<User>
// // , OnModuleInit
// {
//     // private requestService: RequestService

//     // async onModuleInit() {
//     //     // this.requestService = await this.moduleRef.resolve(RequestService)
//     //     // const b = await this.moduleRef.resolve(RequestService)
//     //     // console.log(this.requestService === b)
//     //     const contextId = ContextIdFactory.getByRequest(this.request)
//     //     console.log(contextId)
//     //     this.requestService =  await this.moduleRef.resolve(RequestService, contextId);
//     //     const userData = this.requestService.getUserData()
//     //     console.log(userData)
//     // }

//     constructor(
//         @InjectDataSource() dataSource: DataSource,
//         // @InjectConnection() private readonly connection: Connection,
//         // private requestService: RequestService,
//         // private moduleRef: ModuleRef,
//         // @Inject(REQUEST) private request: Request,
//     ) {
//         dataSource.subscribers.push(this)
//         // connection.subscribers.push(this)
//         // console.log("tanktie")
//         // console.log(dataSource)
//         // dataSource.subscribers.push(this)
//     }

//     listenTo() {
//         return User
//     }

//     async beforeInsert(event: InsertEvent<BaseEntity>) { 

//         console.log("before inserting!!!!!!!!!!!!!!!!!!!!!")
//         console.log()
//         // const contextId = ContextIdFactory.getByRequest(this.request)
//         // console.log(contextId)
//         // this.requestService =  await this.moduleRef.resolve(RequestService, contextId);
//         // const userData = this.requestService.getUserData()
//         // console.log(userData)
//         // event.entity.createdBy = username;
//         // event.entity.updatedBy = username;

//         throw new HttpException("test", HttpStatus.BAD_REQUEST)
//     }
// }