import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:3000"
    }
})
export class Gateway {

    @WebSocketServer()
    server: Server

    @SubscribeMessage("newMessage")
    onNewMessage(@MessageBody() data: any) {
        console.log("newMessage triggered")
        console.log(data)
        this.server.emit("onNotification", data)
    }
}