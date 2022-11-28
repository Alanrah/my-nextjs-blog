import { NextPage } from 'next';
import { message, Empty, Button, Tabs } from 'antd';
import * as AntIcons from '@ant-design/icons'; // LikeOutlined, FireOutlined
import requestInstance from 'service/fetch';
import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { useEffect, useState } from 'react';
// 标签新增管理能力不暴露给用户
const Tag: NextPage = () => {
    const store = useStore();
    const { userId } = store?.user?.userInfo;

    const [active, setActive] = useState('followed');
    const [followTags, setFollowTags] = useState<ITag[]>([]);
    const [allTags, setAllTags] = useState<ITag[]>([]);

    const onChange = (key: string) => {
        setActive(key);
    };

    const getTagsList = async() => {
        const res = await requestInstance.get<any, BaseDataResponse<{followList: Array<ITag>, allList:  Array<ITag>}>>(
            '/api/tag/list',
        );
        if(res?.code === 0) {
            const {followList = [], allList = []} = res?.data;
            setFollowTags(followList);
            setAllTags(allList);
        } else {
            message.error(res?.msg || '获取标签列表失败了');
        }
    };
    // 不传递参数： useEffect不传递第二个参数会导致每次渲染都会运行useEffect
    // 传递空数组：仅在挂载和卸载的时候执行
    useEffect(
        () => { getTagsList(); },
        [userId],// 从未登录到登录状态，需要刷新
    );

    const submitFollow = async (tagId: number, isFollow: boolean) => {
        const res = await requestInstance.post<any, BaseDataResponse<{followList: Array<ITag>, allList:  Array<ITag>}>>(
            '/api/tag/follow',
            {
                tagId,
                type: isFollow ? 'follow' : 'unfollow',
            }
        );
        if(res?.code === 0) {
            message.success(res?.msg || '操作成功');
            getTagsList();
        } else {
            message.error(res?.msg || '操作失败');
        }
    };

    const handleUnFollow = async (tagId: number) => {
        submitFollow(tagId, false);
    };
    const handleFollow = async (tagId: number) => {
        submitFollow(tagId, true);
    };

    const Followed = () => {
        return (<div className={styles.tags}>
            {
                userId ? (followTags?.length
                    ? followTags.map(tag => {
                        return <div className={styles.tagWrapper} key={tag.title}>
                            {/* @ts-ignore */}
                            <div>{AntIcons[tag?.icon].render()}</div>
                            <div className={styles.title}>{tag.title}</div>
                            <div className={styles.title}>
                                {tag.followCount}关注 {tag.articleCount} 文章</div>
                            <Button onClick={() => handleUnFollow(tag.id)}>取消关注</Button>
                        </div>;
                    })
                    : <Empty className={styles.emptyMargin} description="暂无已关注标签"></Empty>)
                    : <Empty description="请先登录"></Empty>
            }
        </div>);
    };
    const ALL = () => {
        return (<div className={styles.tags}>
            {
                allTags?.length
                    ? allTags.map(tag => {
                        return <div className={styles.tagWrapper} key={tag.title}>
                            {/* @ts-ignore */}
                            <div>{AntIcons[tag?.icon].render()}</div>
                            <div className={styles.title}>{tag.title}</div>
                            <div className={styles.title}>
                                {tag.followCount}关注 {tag.articleCount} 文章</div>
                            <div>{
                                tag?.users?.find(user => Number(userId) === Number(user.id))
                                    ? <Button onClick={() => handleUnFollow(tag.id)}>取消关注</Button>
                                    :<Button type="primary" onClick={() => handleFollow(tag.id)}>关注</Button>}</div>
                        </div>;
                    })
                    : <Empty description="暂无标签"></Empty>
            }
        </div>);
    };

    const items = [
        {
            label: <span><AntIcons.LikeOutlined />已关注标签</span>,
            key: 'followed',
            children: Followed()
        },
        {
            label: <span><AntIcons.FireOutlined />全部标签</span>,
            key: 'all',
            children: ALL()
        },
    ];

    return <div className='content-layout'>
        <Tabs defaultActiveKey={'followed'} activeKey={active} items={items} onChange={onChange}/>
    </div>;
};

export default observer(Tag);
