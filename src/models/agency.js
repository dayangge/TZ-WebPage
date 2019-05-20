import { agencyList, transferToDownAgency, transferToDownAgencyList, historyGainsList, applyAgent } from 'services/agency';
const defaultState = {
    agencyTransferRecordBox: false,
    agencyTransferBox: false,
    agencyRelationshipBox: false,
    historyGainsBox: false,
    agencyRuleBox: false,
    agencyTransferInfo:null
};

export default {
    namespace: 'agency',
    state: defaultState,
    effects: {
        *changeAgencyRelationshipBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setAgencyRelationshipBox',
                payload: payload
            });
        },
        *changeAgencyTransferBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setAgencyTransferBox',
                payload: payload
            });
        },
       
        *changeAgencyTransferRecordBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setAgencyTransferRecordBox',
                payload: payload
            });
        },
        *changeHistoryGainsBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setHistoryGainsBox',
                payload: payload
            });
        },
        *changeAgencyTransferInfo({ payload }, { put, select, call }) {
            yield put({
                type: 'setAgencyTransferInfo',
                payload: payload
            });
        },
        *changeAgencyRuleBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setAgencyRuleBox',
                payload: payload
            });
        },
        *getAgencyList({ payload, callback }, { put, select, call }) {
            const res = yield call(agencyList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *toDownAgencyTransfer({ payload, callback }, { put, select, call }) {
            const res = yield call(transferToDownAgency, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getTransferToDownAgencyList({ payload, callback }, { put, select, call }) {
            const res = yield call(transferToDownAgencyList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getHistoryGainsList({ payload, callback }, { put, select, call }) {
            const res = yield call(historyGainsList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *applyToBeAgent({ payload, callback }, { put, select, call }) {
            const res = yield call(applyAgent, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setAgencyRelationshipBox(state, { payload }) {
            return {
                ...state, agencyRelationshipBox: payload
            }
        },
        setAgencyTransferBox(state, { payload }) {
            return {
                ...state, agencyTransferBox: payload
            }
        },
       
        setAgencyTransferRecordBox(state, { payload }) {
            return {
                ...state, agencyTransferRecordBox: payload
            }
        },
        setHistoryGainsBox(state, { payload }) {
            return {
                ...state, historyGainsBox: payload
            }
        },
        setAgencyRuleBox(state, { payload }) {
            return {
                ...state, agencyRuleBox: payload
            }
        },
        setAgencyTransferInfo(state, { payload }) {
            return {
                ...state, agencyTransferInfo: payload
            }
        }
    },
}; 
