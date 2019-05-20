import request from '../utils/request';
import api from '../config/definde';

/**
 * 银行列表
 */
export async function bankList(params) {
    return request.post(api.apiUrl + '/User/getAllBank', params);
}

/**
 * 省份列表
 */
export async function provinceList(params) {
    return request.post(api.apiUrl + '/api/getAreaProvince', params);
}
/**
 * 城市列表
 */
export async function cityList(params) {
    return request.post(api.apiUrl + '/api/getAreaCity', params);
}
/**
 * 密保问题列表
 */
export async function questionList() {
    return request.post(api.apiUrl + '/api/questionList');
}
/**
 * 平台列表
 */
export async function platList() {
    return request.post(api.apiUrl + '/Game/getChannleList');
}