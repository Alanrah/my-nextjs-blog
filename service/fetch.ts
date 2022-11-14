import { message } from 'antd';
import axios from 'axios';

const requestInstance = axios.create({
    baseURL: '/',
});
requestInstance.interceptors.request.use(
    config => config,
    (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(
    response => {
        if(response.status === 200) {
            return response.data;
        } else {
            message.error(response.data);
        }
    },
    (error) => Promise.reject(error),
);

export default requestInstance;