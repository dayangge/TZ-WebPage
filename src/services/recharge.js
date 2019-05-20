import request from '../utils/request';
import api from '../config/definde';

/**
 * 充值记录
 */
export async function rechargeRecordList(params) {
    return request.post(api.apiUrl + '/Recharge/getRechargeList', params);
}

/**
 * 获取微信充值扫描二维码
 */
export async function getWechatRechargeQrcode() {
    return request.post(api.apiUrl + '/Recharge/getWechatScanQR');
}
/**
 * 微信扫描二维码充值
 */
export async function sureWechatRecharge(params) {
    return request.post(api.apiUrl + '/Recharge/wechatRecharge', params);
}

/**
 * 获取支付宝充值扫描二维码
 */
export async function getAlipayRechargeQrcode() {
    return request.post(api.apiUrl + '/Recharge/getAlipayScanQR');
}
/**
 * 支付宝扫描二维码充值
 */
export async function sureAlipayRecharge(params) {
    return request.post(api.apiUrl + '/Recharge/alipayRecharge', params);
}

/**
 * 获取转入银行卡
 */
export async function getRechargeBankCard() {
    return request.post(api.apiUrl + '/User/systemBank');
}

export async function getWechatRechargePayment(params) {
    return request.post(api.apiUrl + '/Recharge/alipayToBankRecharge',params);
}


export async function changeBankRechargeBox(params) {
    return request.post(api.apiUrl + '/User/bankRecharge',params);
}
