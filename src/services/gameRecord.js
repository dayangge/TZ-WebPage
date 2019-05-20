import request from '../utils/request';
import api from '../config/definde';

/**
 * 用户游戏记录
 */
export async function gameRecordList(params) {
    return request.post(api.apiUrl + '/User/getMyGameRecord', params);
}

/**
 * 会员资料
 */
export async function gameRecordListInfo(params) {
    return request.post(api.apiUrl + '/Game_Record/index', params);
}