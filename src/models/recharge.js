import { rechargeRecordList, getWechatRechargeQrcode, getWechatRechargePayment, changeBankRechargeBox, sureWechatRecharge, getAlipayRechargeQrcode, sureAlipayRecharge, getRechargeBankCard } from 'services/recharge';
const defaultState = {
    rechargeRecordBox: false,
    fastRechargeBox: false
};

export default {
    namespace: 'recharge',
    state: defaultState,
    effects: {
        *changeRechargeRecordBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setRechargeRecordBox',
                payload: payload
            });
        },
        *changeFastRechargeBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setFastRechargeBox',
                payload: payload
            });
        },
        *getRechargeRecordList({ payload, callback }, { put, select, call }) {
            const res = yield call(rechargeRecordList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getWechatRechargeQrcode({ payload, callback }, { put, select, call }) {
            const res = yield call(getWechatRechargeQrcode, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *changeBankRechargeBox({ payload, callback }, { put, select, call }) {
            const res = yield call(changeBankRechargeBox, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *sureWechatRecharge({ payload, callback }, { put, select, call }) {
            const res = yield call(sureWechatRecharge, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getAlipayRechargeQrcode({ payload, callback }, { put, select, call }) {
            const res = yield call(getAlipayRechargeQrcode, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *sureAlipayRecharge({ payload, callback }, { put, select, call }) {
            const res = yield call(sureAlipayRecharge, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getRechargeBankCard({ payload, callback }, { put, select, call }) {
            const res = yield call(getRechargeBankCard, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *addFastRecharge({ payload, callback }, { put, select, call }) {
            const res = yield call(addFastRecharge, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getWechatRechargePayment({ payload, callback }, { put, select, call }) {
            const res = yield call(getWechatRechargePayment, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setRechargeRecordBox(state, { payload }) {
            return {
                ...state, rechargeRecordBox: payload
            }
        },
        setFastRechargeBox(state, { payload }) {
            return {
                ...state, fastRechargeBox: payload
            }
        }
    },
}; 
