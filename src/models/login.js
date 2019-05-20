import { login, logout, register } from 'services/login';
import storage from 'utils/localStorage';
const defaultState = {
    loginBox: false,
    registerBox: false,
    registerRuleBox:false,
    loginStatus: storage.get('loginStatus') || false
};

export default {
    namespace: 'login',
    state: defaultState,
    effects: {
        *changeRegisterBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setRegisterBox',
                payload: payload
            });
        },
        *changeLoginStatus({ payload }, { put, select, call }) {
            yield put({
                type: 'setLoginStatus',
                payload: payload
            });
        },
        *changeRegisterRuleBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setRegisterRuleBox',
                payload: payload
            });
        },
        *changeLoginBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setLoginBox',
                payload: payload
            });
        },
        *login({ payload, callback }, { put, select, call }) {
            const res = yield call(login, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *register({ payload, callback }, { put, select, call }) {
            const res = yield call(register, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *logout(_, { call, put }) {
            const res = yield call(logout);
            if (res) {
                yield put({
                    type: 'setLoginStatus',
                    payload: false,
                })
                storage.remove('user');
                storage.remove('loginStatus');
            }
        },
    },
    reducers: {
        setRegisterRuleBox(state, { payload }) {
            return {
                ...state, registerRuleBox: payload
            }
        }, 
        setRegisterBox(state, { payload }) {
            return {
                ...state, registerBox: payload
            }
        }, 
        setLoginStatus(state, { payload }) {
            return {
                ...state, loginStatus: payload
            }
        },
        setLoginBox(state, { payload }) {
            return {
                ...state, loginBox: payload
            }
        }
    },
}; 
