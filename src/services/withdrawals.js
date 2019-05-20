import request from '../utils/request';
import api from '../config/definde';

/**
 * 提现记录
 */
export async function withdrawalsRecordList(params) {
    return request.post(api.apiUrl + '/Recharge/getPutwardList', params);
}

/**
 * 马上提现
 */
export async function addCashWithdrawal(params) {
    return request.post(api.apiUrl + '/User/withdraw', params);
}

/**
 * 获取提现信息
 */
export async function cashWithdrawalInfo(params) {
    return request.post(api.apiUrl + '/User/getWithdrawInfo', params);
}

/**
 * 提现确认信息
 */
export async function withdrawSureInfo(params) {
    return request.post(api.apiUrl + '/User/getWithdrawSureInfo', params, null, false);
}

