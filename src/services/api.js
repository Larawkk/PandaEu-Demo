import request from '../utils/request'

//查询数据
export function getDataList() {
    return request({
        url: '/datalist',
        method: 'post'
    })
}

//接受邀请
export function acceptData(data) {
    return request({
        url: '/acceptData',
        method: 'post',
        data: data
    })
}

//拒绝邀请
export function declineData(data) {
    return request({
        url: '/declineData',
        method: 'post',
        data: data
    })
}

//发送邮件
export function sendMail(mailID) {
    return request({
        url: '/sendEmail',
        method: 'post',
        data: mailID
    })
}