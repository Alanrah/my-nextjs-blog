import { PrimaryGeneratedColumn, Column, BeforeUpdate, BeforeInsert, BaseEntity } from 'typeorm';

export class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column('datetime', { name: 'create_time' })
    createTime!: Date;

    @Column('datetime', { name: 'update_time' })
    updateTime!: Date;

    @BeforeUpdate()
    setupdateTime() {
        this.updateTime = new Date();
    }

    @BeforeInsert()
    setTimeAtCreate() {
        this.createTime = new Date();
        this.updateTime = new Date();
    }
}
