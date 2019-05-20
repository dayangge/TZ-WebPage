import { withdrawalsRecordList, cashWithdrawalInfo, addCashWithdrawal, withdrawSureInfo } from 'services/withdrawals';
const defaultState = {
    withdrawalsRecordBox: false,
    cashWithdrawalBox: false,
    withdrawSureInfoBox: false,
    withdraSureInfo: null
};

export default {
    namespace: 'withdrawals',
    state: defaultState,
    effects: {
        *changeWithdrawalsRecordBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setWithdrawalsRecordBox',
                payload: payload
            });
        },
        *changeCashWithdrawalBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setCashWithdrawalBox',
                payload: payload
            });
        },
        *changeWithdrawSureInfo({ payload }, { put, select, call }) {
            yield put({
                type: 'setWithdrawSureInfo',
                payload: payload
            });
        },
        *changeWithdrawSureInfoBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setWithdrawSureInfoBox',
                payload: payload
            });
        },
        *getWithdrawalsRecordList({ payload, callback }, { put, select, call }) {
            const res = yield call(withdrawalsRecordList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getCashWithdrawalInfo({ payload, callback }, { put, select, call }) {
            const res = yield call(cashWithdrawalInfo, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getWithdrawSureInfo({ payload, callback }, { put, select, call }) {
            const res = yield call(withdrawSureInfo, payload);
            if (res && res.errorCode) {
                callback(res); // 返回结果
            } else if (res) {
                let result = Object.assign(res, payload);
                yield put({
                    type: 'setWithdrawSureInfo',
                    payload: result
                });
                callback(true); // 返回结果
            } else {
                callback(false); // 返回结果
            }
        },
        *addCashWithdrawal({ payload, callback }, { put, select, call }) {
            const res = yield call(addCashWithdrawal, payload);
            if (res || res === 0) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setWithdrawalsRecordBox(state, { payload }) {
            return {
                ...state, withdrawalsRecordBox: payload
            }
        },
        setCashWithdrawalBox(state, { payload }) {
            return {
                ...state, cashWithdrawalBox: payload
            }
        },
        setWithdrawSureInfo(state, { payload }) {
            return {
                ...state, withdraSureInfo: payload
            }
        },
        setWithdrawSureInfoBox(state, { payload }) {
            return {
                ...state, withdrawSureInfoBox: payload
            }
        }
    },
}; 
