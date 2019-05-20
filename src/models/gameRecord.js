import { gameRecordList, gameRecordListInfo } from 'services/gameRecord';
const defaultState = {
    gameRecordBox: false
};

export default {
    namespace: 'gameRecord',
    state: defaultState,
    effects: {
        *changeGameRecordBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setGameRecordBox',
                payload: payload
            });
        },
        *getGameRecordList({ payload, callback }, { put, select, call }) {
            const res = yield call(gameRecordList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getGameRecordListInfo({ payload, callback }, { put, select, call }) {
            const res = yield call(gameRecordListInfo, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }

    },
   
    reducers: {
        setGameRecordBox(state, { payload }) {
            return {
                ...state, gameRecordBox: payload
            }
        }
    },
}; 
