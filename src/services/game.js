import request from '../utils/request';
import api from '../config/definde';

/**
 * 游戏列表
 */
export async function gameList(params) {
    return request.post(api.apiUrl + '/Index/getIndexGameList', params);
}
/**
 * 所有游戏列表
 */
export async function gameAllList() {
    return request.post(api.apiUrl + '/Api/getGameList');
}
export async function gameHomeList() {
    return request.post(api.apiUrl + '/Public_Notice/index');
}
export async function gameHomeCodeList() {
    return request.post(api.apiUrl + '/Banner/getImgNotice');
}
/**
 * 获取游戏链接地址
 * @param {*} params
 */
export async function getGameHref(params) {
    return request.post(api.apiUrl + '/Game/getGameByGameId', params);
}