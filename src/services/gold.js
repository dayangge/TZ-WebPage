import request from '../utils/request';
import api from '../config/definde';

/**
 * 金币转账记录
 */
export async function goldTransferRecord(params) {
    return request.post(api.apiUrl + '/Tranaccount/gettranAccountList', params);
}

/**
 * 金币转入或转出
 */
export async function goldTransferOrWithdrawal(params) {
    return request.post(api.apiUrl + '/Tranaccount/userModelTurnAccess', params, null, false);
}
/**
 * 刷新用户金币
 */
export async function refreshUserGold() {
    return request.post(api.apiUrl + '/User/getUserGold', null, null, false);
}