import { Column, Entity, ManyToOne, JoinColumn } from "typeorm"
import { CommonEntity } from './commonEntity';
import { User } from './user';
import { Articles } from './articles';

@Entity({ name: 'comments' })
export class Comment extends CommonEntity {
    @Column('varchar', { nullable: false })
    content!: string;

    @ManyToOne(() => User, { cascade: true }) // 多个评论，对应一个用户
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User | undefined;

    @ManyToOne(() => Articles, { cascade: true }) // 多个评论，对应一篇文章
    @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
    article: Articles | undefined;
}
