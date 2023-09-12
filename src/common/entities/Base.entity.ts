import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export class BaseEntity {

    @Column({nullable: true})
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    updatedBy: string;
    
    @UpdateDateColumn()
    updatedAt: Date;

}