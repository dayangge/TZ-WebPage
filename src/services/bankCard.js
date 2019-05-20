import request from '../utils/request';
import api from '../config/definde';

/**
 * 用户绑定银行卡列表
 */
export async function bankCardList(params) {
    return request.post(api.apiUrl + '/User/getUserBindBankInfo', params);
}

/**
 * 用户添加绑定银行卡
 */
export async function addBankCard(params) {
    return request.post(api.apiUrl + '/User/userBindBankCard', params);
}