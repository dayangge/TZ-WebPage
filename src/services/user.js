import request from '../utils/request';
import api from '../config/definde';

/**
 * 修改登录密码
 */
export async function updateLoginPwd(params) {
    return request.post(api.apiUrl + '/User/updateLoginPwd', params, null, false);
}
/**
 * 修改资金密码
 */
export async function updateUserInfo(params) {
    return request.post(api.apiUrl + '/User/updateUserinfo', params, null, false);
}
