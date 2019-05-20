import { connect } from 'dva';
import { Modal, Spin } from 'antd';
import styles from '../style/messageInfoView.css';

class MessageInfoView extends React.Component {
    constructor() {
        super();
        this.state = {
            messageInfo: null
        }
    }

    componentDidMount() {
        this.onGetMessageInfo();
    }

    onGetMessageInfo() {
        let typeModel = null;
        if (this.props.messageType === 1) {
            typeModel = 'message/getMessageInfo';
        } else {
            typeModel = 'message/getSendMessageInfo';
        }
        let params = {};
        params.msgId = this.props.messageId;

        this.props.dispatch({
            type: typeModel,
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        messageInfo: res
                    });
                }
            }
        });
    }

    hideMessageInfoBox() {
        this.props.dispatch({
            type: 'message/changeMessageInfoBox',
            payload: false
        });
        let param = {};
        param.mesId = null;
        param.type = this.props.messageType;
        this.props.dispatch({
            type: 'message/changeMessageId',
            payload: param
        });
        this.props.dispatch({
            type: 'message/changeMyMessageBox',
            payload: true
        });
    }

    render() {
        const { messageInfoBox, loading } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'50vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={messageInfoBox}
                onCancel={() => this.hideMessageInfoBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.changeAmountBox}>
                        <div className={styles.changeAmountBody}>
                            <div className={styles.changeAmountBodyBox}>
                                <div className={styles.changeAmountBodyBoxTitle}>{this.state.messageInfo === null ? null : this.state.messageInfo.title}</div>
                                <div className={styles.changeAmountBodyBoxBody}>
                                    <div className={styles.changeAmountBodyBoxBodyInfo}>
                                        <div className={styles.changeAmountBodyBoxBodyInfoNews}>
                                            <span>发送人：</span>
                                            <span>{this.state.messageInfo === null ? null : this.state.messageInfo.send_user_name}</span>
                                        </div>
                                        <div className={styles.changeAmountBodyBoxBodyInfoNews}>
                                            <span>时间：</span>
                                            <span>{this.state.messageInfo === null ? null : this.state.messageInfo.created_at}</span>
                                        </div>
                                    </div>
                                    <div className={styles.changeAmountBodyBoxBodyInfoBackwater}>
                                        <span style={{ tableLayout:'fixed',  wordBreak: 'break-all', overflow:'hidden'}}>{this.state.messageInfo === null ? null : this.state.messageInfo.content}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        messageInfoBox: state.message.messageInfoBox,
        messageId: state.message.messageId,
        messageType: state.message.messageType,
        loading: state.loading.effects['message/getMessageInfo', 'message/getSendMessageInfo'] || false
    }
}

export default connect(mapStateToProps)(MessageInfoView);