import request from '../utils/request';
import api from '../config/definde';

/**
 * 下级列表
 */
export async function agencyList(params) {
    return request.post(api.apiUrl + '/User/getUserDownAgent', params);
}

/**
 * 给下级转账
 */
export async function transferToDownAgency(params) {
    return request.post(api.apiUrl + '/Tranaccount/userMoneyToDownUser', params, null, false);
}
/**
 * 给下级转账记录列表
 */
export async function transferToDownAgencyList(params) {
    return request.post(api.apiUrl + '/Tranaccount/userTranAccountRecord', params);
}

/**
 * 获取历史收益
 */
export async function historyGainsList(params) {
    return request.post(api.apiUrl + '/User/historyScore', params);
}

/**
 * 申请成为代理
 */
export async function applyAgent(params) {
    return request.post(api.apiUrl + '/User/userBeAgent', params);
}
