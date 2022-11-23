// 问题： 编辑器用什么？支持 nextjs
// https://www.npmjs.com/package/@uiw/react-md-editor
import { NextPage } from "next";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { MDEditorProps } from '@uiw/react-md-editor';
// import * as commands from '@uiw/react-md-editor/esm/commands';
import { useState, ChangeEvent } from "react";
import styles from './index.module.scss';
import { Input, Button, message } from 'antd';
import requestInstance from 'service/fetch';
import { useRouter } from "next/router";
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';

const MDEditor: NextPage = dynamic<MDEditorProps>(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

const NewEditor: NextPage = () => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    const { push } = useRouter();

    const store = useStore();

    const handlePublish = async () => {
        if(!title) {
            message.warn('请输入文章标题');
            return;
        }
        const res = await requestInstance.post<any, BaseDataResponse<any>>(
            '/api/article/publish',
            {
                title,
                content,
            }
        );
        if(res.code === 0) {
            message.success(res.msg || '发布成功');
            push(`/user/${store.user.userInfo.userId}`);
        } else {
            message.error(res.msg || '发布失败');
        }
    }
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e?.target?.value);
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
(NewEditor as any).layout = null;
export default observer(NewEditor);
