import { goldTransferRecord, goldTransferOrWithdrawal } from 'services/gold';
const defaultState = {
    transferRecordBox: false,
    goldTransferBox:false
};

export default {
    namespace: 'gold',
    state: defaultState,
    effects: {
        *changeTransferRecordBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setTransferRecordBox',
                payload: payload
            });
        },
        *changeGoldTransferBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setGoldTransferBox',
                payload: payload
            });
        },
        *getGoldTransferRecord({ payload, callback }, { put, select, call }) {
            const res = yield call(goldTransferRecord, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *addGoldTransferOrWithdrawal({ payload, callback }, { put, select, call }) {
            const res = yield call(goldTransferOrWithdrawal, payload);
            if (res || res === 0) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setTransferRecordBox(state, { payload }) {
            return {
                ...state, transferRecordBox: payload
            }
        },
        setGoldTransferBox(state, { payload }) {
            return {
                ...state, goldTransferBox: payload
            }
        }
    },
}; 
