import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { BaseEntity } from "./Base.entity";
import { Role } from "./Role.entity";

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

    @ManyToMany(() => Role, {onDelete: "CASCADE"})
    @JoinTable({name: "users_roles"})
    roles: Role[]
}