import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import { BaseEntity } from "./Base.entity";

@Entity({
    name: "users"
})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string;
}