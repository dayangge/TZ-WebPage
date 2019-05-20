import request from '../utils/request';
import api from '../config/definde';

/**
 * 消息列表
 */
export async function messageList(params) {
    return request.post(api.apiUrl + '/User/getUserMessage', params);
}
export async function messageInfoList(params) {
    return request.post(api.apiUrl + '/Outbox/getList', params);
}
/**
 * 消息详情
 */
export async function messageInfo(params) {
    return request.post(api.apiUrl + '/User/getUserMessageInfo', params);
}
/**
 * 发件箱消息详情  dasd 
 */
export async function messageSendInfo(params) {
    return request.post(api.apiUrl + '/Outbox/detail', params);
}

/**
 * 会员消息
 */
export async function memberInfo(params) {
    return request.post(api.apiUrl + '/User/getUserInfo', params );
}
/**
 * 发送消息
 */
export async function sendMessage(params) {
    return request.post(api.apiUrl + '/user/sendMessageToDown', params);
}

