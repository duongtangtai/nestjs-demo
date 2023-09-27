import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { UUID } from "crypto";
import { Role } from "./Role.entity";

@Entity("permissions")
export class Permission extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: UUID;

    @Column()
    name: string;

    @Column()
    description: string;
}