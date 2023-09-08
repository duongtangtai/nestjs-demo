import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: "users"
})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    updatedBy: string;
    
    @UpdateDateColumn()
    updatedAt: Date;
}