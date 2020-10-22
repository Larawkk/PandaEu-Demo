import axios from 'axios'
import { message } from 'antd';

//创建axios实例
const service = axios.create({
    baseURL: 'http://127.0.0.1:8080', //api的base_url
    timeout: 20000 //请求超时数
})

//请求拦截器
service.interceptors.request.use(config => {
    return config;
}, error => {
    //处理请求错误
    Promise.reject(error);
})

//返回响应处理
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.status !== 200) {
            message.error(res.msg);
            return Promise.reject(res.msg);
        } else {
            return response.data;
        }
    }, error => {
        if (error.response && error.response.status === 401) {
            message.error('信息无效');
        } else if (error.response && error.response.status === 500) {
            message.error('系统错误');
        } else if (error.message && error.message.indexOf("timeout") > -1) {
            message.error('网络超时');
        } else if (error === "403") {
            message.error('没有请求权限');
        } else {
            message.error('网络错误');
        }
        return Promise.reject(error);
    }
)

export default service;



