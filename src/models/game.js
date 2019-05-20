import { gameList, getGameHref, gameAllList,gameHomeList, gameHomeCodeList } from 'services/game';
import { refreshUserGold } from 'services/gold';
import storage from 'utils/localStorage';
const defaultState = {
    gameList: [],
    gameCount: 0,
    gameListStatus: false,
    gameHref: null,
    playGameBox: false,
    playGameBoxTypeMenu:false
};

export default {
    namespace: 'game',
    state: defaultState,
    effects: {
        *getGameList({ payload }, { put, select, call }) {
            const res = yield call(gameList, payload);
            if (res) {
                yield put({
                    type: 'setGameList',
                    payload: res.list || []
                });
                yield put({
                    type: 'setGameCount',
                    payload: res.count || 0
                });
            }
        },
        *changeGameListStatus({ payload }, { put, select, call }) {
            yield put({
                type: 'setGameListStatus',
                payload: payload
            });
        },
        *changePlayGameBoxType({ payload }, { put, select, call }) {
            yield put({
                type: 'setPlayGameBoxType',
                payload: payload
            });
        },        
        *getGameUrl({ payload }, { put, select, call }) {
            const res = yield call(getGameHref, payload);
            if (res) {
                let userInfoString = storage.get('user');
                let userInfoObject = JSON.parse(userInfoString);
                if (userInfoObject.is_automatic === 1) {
                    userInfoObject.total = 0;
                    storage.add('user', userInfoObject);
                }
                yield put({
                    type: 'setPlayGameBox',
                    payload: true
                });
                yield put({
                    type: 'setGameHref',
                    payload: res
                });
            }
        },
        *getGameHomeList({ payload, callback }, { put, select, call }) {
            const res = yield call(gameHomeList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getGameHomeCodeList({ payload, callback }, { put, select, call }) {
            const res = yield call(gameHomeCodeList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *closePlayBox(_, { put, select, call }) {
            const res = yield call(refreshUserGold);
            if (res && res.errorCode) {
                return;
            } else {
                let userInfoString = storage.get('user');
                let userInfoObject = JSON.parse(userInfoString);
                if (res !== 0) {
                    userInfoObject.total = res;
                    storage.add('user', userInfoObject);
                }
            }

            yield put({
                type: 'setPlayGameBox',
                payload: false
            });
            yield put({
                type: 'setGameHref',
                payload: null
            });
        },
        *getGameAllList({ payload, callback }, { put, select, call }) {
            const res = yield call(gameAllList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setGameList(state, { payload }) {
            return {
                ...state, gameList: payload
            }
        },
        setGameCount(state, { payload }) {
            return {
                ...state, gameCount: payload
            }
        },
        setPlayGameBoxType(state, { payload }) {
            return {
                ...state, playGameBoxTypeMenu: payload
            }
        },
        setGameListStatus(state, { payload }) {
            return {
                ...state, gameListStatus: payload
            }
        },
        setPlayGameBox(state, { payload }) {
            return {
                ...state, playGameBox: payload
            }
        },
        setGameHref(state, { payload }) {
            return {
                ...state, gameHref: payload
            }
        }
    },
}; 
