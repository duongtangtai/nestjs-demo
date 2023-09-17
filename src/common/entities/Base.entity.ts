import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export class BaseEntity {

    @Column()
    created_by: string;

    @CreateDateColumn({type: "timestamptz"})
    created_at: Date;

    @Column()
    updated_by: string;
    
    @UpdateDateColumn({type: "timestamptz"})
    updated_at: Date;
}