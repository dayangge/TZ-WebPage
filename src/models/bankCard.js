import { bankCardList, addBankCard } from 'services/bankCard';
const defaultState = {
    bankCardBox: false,
    addBankCardBox: false
};

export default {
    namespace: 'bankCard',
    state: defaultState,
    effects: {
        *changeBankCardBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setBankCardBox',
                payload: payload
            });
        },
        *changeAddBankCardBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setAddBankCardBox',
                payload: payload
            });
        },
        *getBankCardList({ payload, callback }, { put, select, call }) {
            const res = yield call(bankCardList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *addBankCard({ payload, callback }, { put, select, call }) {
            const res = yield call(addBankCard, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setBankCardBox(state, { payload }) {
            return {
                ...state, bankCardBox: payload
            }
        },
        setAddBankCardBox(state, { payload }) {
            return {
                ...state, addBankCardBox: payload
            }
        }
    },
}; 
