import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message } from 'antd';
import request from 'service/fetch';
import styles from './index.module.scss';
import { useStore } from 'store';
import { useRouter } from 'next/router';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 4 },
};

interface EditInfo {
    nickname: string,
    job: string,
    introduce: string,
}

const UserProfile = () => {
    const [form] = Form.useForm();
    const store = useStore();
    const {push} = useRouter();

    useEffect(() => {
        request.get<null, BaseDataResponse<{userInfo: IUser}>>('/api/user/detail', {params: {id: store.user.userInfo.userId}}).then((res) => {
            if (res?.code === 0) {
                form.setFieldsValue(res?.data?.userInfo);
            } else {
                message.error(res.msg)
            }
        });
    }, [form]);

    const handleSubmit = (values: EditInfo) => {
        request.post<EditInfo, BaseDataResponse<IUser>>('/api/user/update', { ...values }).then((res) => {
            if (res?.code === 0) {
                message.success('修改成功');
                store.user.setUserInfo({userId: res?.data?.id, nickname: res?.data?.nickname, avatar: res?.data?.avatar,});
                push(`/user/${res?.data?.id}`)
            } else {
                message.error(res?.msg || '修改失败');
            }
        });
    };

    return (
        <div className="content-layout">
            <div className={styles.userProfile}>
                <h2>个人资料</h2>
                <div>
                    <Form
                        {...layout}
                        form={form}
                        className={styles.form}
                        onFinish={handleSubmit}
                    >
                        <Form.Item label="用户名" name="nickname">
                            <Input placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item label="职位" name="job">
                            <Input placeholder="请输入职位" />
                        </Form.Item>
                        <Form.Item label="个人介绍" name="introduce">
                            <Input placeholder="请输入个人介绍" />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                保存修改
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default observer(UserProfile);
