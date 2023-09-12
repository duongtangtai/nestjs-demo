import { UUID } from "crypto";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./Base.entity";
import { Permission } from "./Permission.entity";

@Entity("roles")
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: UUID;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => Permission, {onDelete: "NO ACTION"})
    @JoinTable({name: "roles_permissions"})
    permissions: Permission[]
}