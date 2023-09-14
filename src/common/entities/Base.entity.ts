import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export class BaseEntity {

    @Column()
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    updatedBy: string;
    
    @UpdateDateColumn()
    updatedAt: Date;
}