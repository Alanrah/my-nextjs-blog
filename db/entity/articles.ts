import { Column, Entity, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm"
import { CommonEntity } from './commonEntity';
import { User } from './user';
import { Comment } from "./comments";
import { Tag } from './tags';

@Entity({ name: 'articles' })
export class Articles extends CommonEntity {
    @Column('varchar', { nullable: false })
    title!: string;

    @Column('varchar', { nullable: false })
    content!: string;

    @Column('int', { nullable: true, default: 0 })
    views: number | undefined;

    @Column('int', { nullable: true, name: 'is_delete', default: 0 })
    isDelete!: number;

    @ManyToOne(() => User, { cascade: true }) // 多篇文章，对应一个用户
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // 'id' 是user对应的列的名字
    user: User | undefined; // 根据 user_id查到的user对象，名称就是 user

    @OneToMany(() => Comment, (comment) => comment.article)
    comments!: Comment[]

    // 注意，反向关系没有@JoinTable。 @JoinTable必须只在关系的一边。、
    // 新增文章时，对应的标签tag的article_count也要同步联动
    @ManyToMany(() => Tag, (tag) => tag.articles, {
        cascade: true
    })
    tags!: Tag[]
}
