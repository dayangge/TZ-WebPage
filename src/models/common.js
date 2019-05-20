import { bankList, provinceList, cityList, questionList,platList } from 'services/common';
const defaultState = {
    menuStatus: false,
    menuKeys: null
};

export default {
    namespace: 'common',
    state: defaultState,
    effects: {
        *changeMenuStatus({ payload }, { put, select, call }) {
            if (payload) {
                yield put({
                    type: 'setMenuStatus',
                    payload: payload
                });
            } else {
                yield put({
                    type: 'setMenuStatus',
                    payload: payload
                });
                yield put({
                    type: 'setMenuKeys',
                    payload: null
                });
            }
        },
        *changeMenuKeys({ payload }, { put, select, call }) {
            yield put({
                type: 'setMenuKeys',
                payload: payload
            });
        },
        *getPlatList({ payload, callback }, { put, select, call }) {
            const res = yield call(platList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getQuestionList({ payload, callback }, { put, select, call }) {
            const res = yield call(questionList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getBankList({ payload, callback }, { put, select, call }) {
            const res = yield call(bankList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getProvinceList({ payload, callback }, { put, select, call }) {
            const res = yield call(provinceList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getCityList({ payload, callback }, { put, select, call }) {
            const res = yield call(cityList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setMenuStatus(state, { payload }) {
            return {
                ...state, menuStatus: payload
            }
        },
        setMenuKeys(state, { payload }) {
            return {
                ...state, menuKeys: payload
            }
        }
    },
}; 
