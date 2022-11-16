import { PrimaryGeneratedColumn, Column, BeforeUpdate, BeforeInsert } from 'typeorm';

export class CommonEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
    readonly id!: string;

    @Column('bigint', { name: 'create_time' })
    createTime!: string;

    @Column('bigint', { name: 'update_time' })
    updateTime!: string;

    @BeforeUpdate()
    setupdateTime() {
        this.updateTime = String(Date.now());
    }

    @BeforeInsert()
    setTimeAtCreate() {
        this.createTime = String(Date.now());
        this.updateTime = String(Date.now());
    }
}
