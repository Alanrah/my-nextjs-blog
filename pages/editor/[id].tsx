// 问题： 编辑器用什么？支持 nextjs
// https://www.npmjs.com/package/@uiw/react-md-editor
import { NextPage } from "next";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { MDEditorProps } from '@uiw/react-md-editor';
// import * as commands from '@uiw/react-md-editor/esm/commands';
import { useState, ChangeEvent, useEffect } from "react";
import styles from './index.module.scss';
import { Input, Button, message, Select } from 'antd';
import requestInstance from 'service/fetch';
import { useRouter } from "next/router";
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { GetServerSideProps } from 'next';

interface IProps {
    article: IArticle,
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const res = await requestInstance.get<any, BaseDataResponse<Array<IArticle>>>(`http://${context.req.headers.host}/api/article/detail`, {
        params: {
            id: context.params.id,
            isView: 0,
        }
    });

    if (res.code !== 0) {
        message.error(res.msg || '获取文章详情失败');
    }

    return {
        props: {
            article: res?.data || {},
        },
    }
}

const MDEditor: NextPage = dynamic<MDEditorProps>(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

const ModifyEditor = (props: IProps) => {
    const { article } = props;

    const [content, setContent] = useState(article.content || '');
    const [title, setTitle] = useState(article.title || '');
    const [allTags, setAllTags] = useState<ITag[]>([]);
    const [tagIds, setTagIds] = useState<number[]>(article.tags?.map(tag => tag.id));

    const { push } = useRouter();

    const store = useStore();

    const handlePublish = async () => {
        if (Number(store.user.userInfo.userId) !== Number(article.user.id)) {
            message.warn('无修改文章的权限！');
            return;
        }
        if (!title) {
            message.warn('请输入文章标题');
            return;
        }
        const res = await requestInstance.post<any, BaseDataResponse<any>>(
            '/api/article/update',
            {
                title,
                content,
                id: article.id,
                tagIds,
            }
        );
        if (res.code === 0) {
            message.success(res.msg || '更新成功');
            push(`/article/${article.id}`);
        } else {
            message.error(res.msg || '更新失败');
        }
    }
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e?.target?.value);
    }

    const getAllTags = async () => {
        const res = await requestInstance.get<any, BaseDataResponse<{followList: Array<ITag>, allList:  Array<ITag>}>>(
            '/api/tag/list',
        );
        if(res?.code === 0) {
            const {allList = []} = res?.data;
            setAllTags(allList);
        } else {
            message.error(res?.msg || '获取标签列表失败了');
        }
    }
    useEffect(() => {
        getAllTags();
    }, []);
    const selectFieldNames = {
        value: 'id',
        label: 'title'
    };
    const handleSelectTag = (ids: number[]) => {
        setTagIds(ids);
    }

    return (
        <div className={styles.container}>
            <div className={styles.operation}>
                {/* 受控组件，输入框是由开发者设置的，而不是组件自身控制实现 */}
                <Input
                    className={styles.title}
                    type="text"
                    placeholder="请输入文章标题"
                    value={title}
                    onChange={handleTitleChange}
                ></Input>
                {allTags.length &&
                <Select
                    className={styles.tag}
                    mode="multiple"
                    allowClear
                    placeholder="请选择标签"
                    onChange={handleSelectTag}
                    options={allTags}
                    fieldNames={selectFieldNames}
                    defaultValue={tagIds}
                ></Select>}
                <Button type="primary" className={styles.button} onClick={handlePublish}>发布</Button>
            </div>
            <MDEditor
                value={content}
                onChange={setContent}
                height={1080}
            />
        </div>

    )
}
// 问题：在编辑器页面，不希望显示顶部的导航栏 layOut 该怎么办？
// 用属性 layout 确认是否要显示导航栏，并在 _app.tsx 中使用这个属性判断是否要展示导航栏
(ModifyEditor as any).layout = null;
export default observer(ModifyEditor);
