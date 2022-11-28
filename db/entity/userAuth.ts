import { Column, Entity, ManyToOne, JoinColumn } from "typeorm"
import { CommonEntity } from './commonEntity';
import { User } from "./user";
// user-auths 和 user 表是多对一 many to one 的关系，user_id 是个外键
@Entity({ name: 'user_auths' }) // name 就是这个实体映射的表名
export class UserAuth extends CommonEntity {
    @Column('varchar', { name: 'identity_type' })
    identityType: string | undefined;

    @Column('varchar') // 不写类型居然会报错
    identifier: string | undefined;

    @Column('varchar')
    credential: string | undefined;
    // 一对多的关系可以通过设置外键存储
    @ManyToOne(() => User, { cascade: true })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // 'id' 是user对应的列的名字
    user: User | undefined; // 根据 user_id查到的user对象，名称就是 user
}
