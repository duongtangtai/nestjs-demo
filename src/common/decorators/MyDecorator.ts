// import { ExecutionContext, createParamDecorator } from "@nestjs/common";
// import { Request } from "express";

// export const MyDecorator = createParamDecorator(
//     (data: any, ctx: ExecutionContext) => {
//         console.log("MyDecorator=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
//         const request = ctx.switchToHttp().getRequest()
//         console.log(request.headers)
//         console.log(request.principle)
//         return request.body? request.body?.[data] : request.body
//     }
// )

// export const TestDecorator = () => {
//     console.log("TestDecorator");
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log("first(): called");
//     };
// }