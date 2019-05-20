const defaultState = {
    userInfoBox: false
};

export default {
    namespace: 'userinfo',
    state: defaultState,
    effects: {
        *changeUserInfoBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setUserInfoBox',
                payload: payload
            });
        }
    },
    reducers: {
        setUserInfoBox(state, { payload }) {
            return {
                ...state, userInfoBox: payload
            }
        }
    },
}; 
