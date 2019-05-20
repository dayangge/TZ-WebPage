import request from '../utils/request';
import api from '../config/definde';

/**
 * 登录
 * @param {*} params
 */
export async function login(params) {
    return request.post(api.apiUrl + '/Login/login', params, null, false);
}

/**
 * 退出登录
 */
export async function logout() {
    return request.post(api.apiUrl + '/Login/logout');
}

/**
 * 注册
 * @param {*} params
 */
export async function register(params) {
    return request.post(api.apiUrl + '/Login/userRegister', params, null, false);
}