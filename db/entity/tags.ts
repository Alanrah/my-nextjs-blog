import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user'
import { Articles } from './articles'
import { CommonEntity } from './commonEntity';

@Entity({ name: 'tags' })
export class Tag extends CommonEntity {
    @Column('varchar')
    icon!: string;

    @Column('varchar')
    title!: string;

    @Column('int', { name: 'follow_count' })
    followCount!: number;

    @Column('int', { name: 'article_count' })
    articleCount!: number;

    // 问题： ManyToMany ，多对多的关系，外键 和 JoinColumn已经不能满足关联需求了
    // 需要新建一张关系表 ，joinTable
    @ManyToMany(() => User, {
        cascade: true
    })
    @JoinTable({
        name: 'tags_users_relation', // tags_users_relation 存储 tags 和 users 的关系
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: { // 反向联接列
            name: 'user_id'
        }
    })
    users!: User[]

    @ManyToMany(() => Articles, (article) => article.tags)
    @JoinTable({
        name: 'tags_articles_relation',
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: {
            name: 'article_id'
        }
    })
    articles!: Articles[]
}
