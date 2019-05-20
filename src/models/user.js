import { updateLoginPwd, updateUserInfo } from 'services/user';
const defaultState = {
    loginPassBox: false,
    fundPassBox: false
};

export default {
    namespace: 'user',
    state: defaultState,
    effects: {
        *changeLoginPassBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setLoginPassBox',
                payload: payload
            });
        },
        *changeFundPassBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setFundPassBox',
                payload: payload
            });
        },
        *updateLoginPwd({ payload, callback }, { put, select, call }) {
            const res = yield call(updateLoginPwd, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *updateFundPass({ payload, callback }, { put, select, call }) {
            const res = yield call(updateUserInfo, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setLoginPassBox(state, { payload }) {
            return {
                ...state, loginPassBox: payload
            }
        },
        setFundPassBox(state, { payload }) {
            return {
                ...state, fundPassBox: payload
            }
        }
    },
}; 
