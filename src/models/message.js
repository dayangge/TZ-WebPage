import { messageList, messageInfoList, messageInfo, messageSendInfo, sendMessage ,memberInfo } from 'services/message';
const defaultState = {
    myMessageBox: false,
    sendMessageBox: false,
    messageInfoBox: false,
    messageUserId: null,
    messageUserAccount: null,
    messageId: 1,
    messageType: 1,
    memberRecordBox:false,
};

export default {
    namespace: 'message',
    state: defaultState,
    effects: {
        *changeMyMessageBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setMyMessageBox',
                payload: payload
            });
        },
        *changeSendMessageBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setSendMessageBox',
                payload: payload
            });
        },
        *changeMemberGainsBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setMemberTransferBox',  //asdasd
                payload: payload
            });
        },
        *changeMessageInfoBox({ payload }, { put, select, call }) {
            yield put({
                type: 'setMessageInfoBox',
                payload: payload
            });
        },
        *changeMessageReciveUserInfo({ payload }, { put, select, call }) {
            yield put({
                type: 'setMessageReciveUserInfo',
                payload: payload
            });
        },
        *changeMessageId({ payload }, { put, select, call }) {
            yield put({
                type: 'setMessageId',
                payload: payload.mesId
            });
            yield put({
                type: 'setMessageType',
                payload: payload.type
            });

        },
        *changeMessageType({ payload }, { put, select, call }) {
            yield put({
                type: 'setMessageType',
                payload: payload
            });
        },
        *getMessageList({ payload, callback }, { put, select, call }) {
            const res = yield call(messageList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getMessageInfoList({ payload, callback }, { put, select, call }) {
            const res = yield call(messageInfoList, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getMessageInfo({ payload, callback }, { put, select, call }) {
            const res = yield call(messageInfo, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getSendMessageInfo({ payload, callback }, { put, select, call }) {
            const res = yield call(messageSendInfo, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *getMemberInfo({ payload, callback }, { put, select, call }) {
            const res = yield call(memberInfo, payload);
            if (res) {
                callback(res); // 返回结果
            }
        },
        *toSendMessage({ payload, callback }, { put, select, call }) {
            const res = yield call(sendMessage, payload);
            if (res) {
                callback(res); // 返回结果
            }
        }
    },
    reducers: {
        setMyMessageBox(state, { payload }) {
            return {
                ...state, myMessageBox: payload
            }
        },
        
        setMemberTransferBox(state, { payload }) {
            return {
                ...state, memberRecordBox: payload
            }
        },
        setSendMessageBox(state, { payload }) {
            return {
                ...state, sendMessageBox: payload
            }
        },
       
        setMessageInfoBox(state, { payload }) {
            return {
                ...state, messageInfoBox: payload
            }
        },
        setMessageReciveUserInfo(state, { payload }) {
            return {
                ...state, messageUserId: payload.userId, messageUserAccount: payload.account
            }
        },
        setMessageId(state, { payload }) {
            return {
                ...state, messageId: payload
            }
        },
        setMessageType(state, { payload }) {
            return {
                ...state, messageType: payload
                
            }
           
        }
    },
}; 
