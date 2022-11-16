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

    @ManyToOne(() => User, { cascade: true })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // 外键的名字
    userId: User | undefined; // todo 怎么把这个变量name设置成userId呢，find时候打印的数据里面没有userId这个字段
}
