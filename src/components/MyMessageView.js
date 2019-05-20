import { connect } from 'dva';
import { Modal, Spin, Empty } from 'antd';
import styles from '../style/myMessage.css';
import PaginationView from 'components/PaginationView';
import storage from 'utils/localStorage';

class MyMessageView extends React.Component {
    constructor() {
        super();
        this.state = {
            pageNum: 1,
            pageSize: 8,
            messageList: [],
            messageCount: 0,
            agentId: null,
            messageType: 1
        }
    }

    componentDidMount() {
        let userInfoString = storage.get('user');
        let userInfoObject = JSON.parse(userInfoString);
        this.setState({
            agentId: userInfoObject.agent_id,
            messageType: this.props.messageType
        }, () => {
            if (this.props.messageType === 1) {
                this.onGetMessageList();
            } else {
                this.onGetMessageInfoList();
            }
        });
    }

    onGetMessageList() {
        let params = {};
        params.page_size = this.state.pageSize;
        params.page = this.state.pageNum;
        this.props.dispatch({
            type: 'message/getMessageList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        messageList: res.list,
                        messageCount: res.count
                    });
                }
            }
        });
    }
    onGetMessageInfoList() {
        let params = {};
        params.pageSize = this.state.pageSize;
        params.pageIndex = this.state.pageNum;

        this.props.dispatch({
            type: 'message/getMessageInfoList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        messageList: res.list,
                        messageCount: res.count
                    });

                }

            }
        });
    }

    onPrePage = () => {
        if (this.state.pageNum <= 1) {
            return false;
        } else {
            this.setState({
                pageNum: this.state.pageNum - 1
            }, () => {
                if (this.state.messageType === 1) {
                    this.onGetMessageList();
                } else {
                    this.onGetMessageInfoList();
                }
            })
        }
    }

    onNextPage = () => {
        let pageTotal = Math.ceil(this.state.messageCount / this.state.pageSize);
        if (this.state.pageNum >= pageTotal) {
            return false;
        } else {
            this.setState({
                pageNum: this.state.pageNum + 1
            }, () => {
                if (this.state.messageType === 1) {
                    this.onGetMessageList();
                } else {
                    this.onGetMessageInfoList();
                }
            })
        }
    }

    hideMyMessageBox() {
        this.props.dispatch({
            type: 'message/changeMyMessageBox',
            payload: false
        });
        this.props.dispatch({
            type: 'message/changeMessageType',
            payload: 1
        });
    }

    getMessageInfo(msgId) {   //查看
        this.props.dispatch({
            type: 'message/changeMyMessageBox',
            payload: false
        });
        let obj = {};
        obj.mesId = msgId;
        obj.type = this.state.messageType;
        this.props.dispatch({
            type: 'message/changeMessageId',
            payload: obj
        });
        this.props.dispatch({
            type: 'message/changeMessageInfoBox',
            payload: true
        });
    }

    onClickSendToUser(userId, Account) {
        this.props.dispatch({
            type: 'message/changeMyMessageBox',
            payload: false
        });
        let params = {};
        params.userId = userId;
        params.account = Account;
        this.props.dispatch({
            type: 'message/changeMessageReciveUserInfo',
            payload: params
        });
        this.props.dispatch({
            type: 'message/changeSendMessageBox',
            payload: true
        });
    }

    onChangeRechargeType(type) {    //收发件箱
        this.props.dispatch({
            type: 'message/changeMessageType',
            payload: type
        });
        this.setState({
            messageType: type,
            pageNum: 1,
            pageSize: 8,
            messageList: [],
            messageCount: 0
        }, () => {
            if (type === 1) {
                this.onGetMessageList();
            } else {
                this.onGetMessageInfoList();
            }
        });
    }
    renderMessageList() {
        if (this.state.messageList.length > 0) {
            let messageList = this.state.messageList;
            let views = [];
            for (let i = 0; i < messageList.length; i++) {
                const item = messageList[i];
                if (this.state.messageType === 1) {
                    views.push(
                        <tr key={i}>
                            <td>{item.created_at}</td>
                            <td>{item.send_user_name}</td>
                            <td>{item.title ? (item.title.length > 8 ? item.title.substr(0, 8) + "..." : item.title) : ""}</td>
                            <td>{item.status}</td>
                            <td>
                                <span onClick={this.getMessageInfo.bind(this, item.id)}>查看</span>
                            </td>
                        </tr>
                    );
                } else {
                    views.push(
                        <tr key={i}>
                            <td>{item.created_at}</td>
                            <td>{item.recipient_name}</td>
                            <td>{item.title ? (item.title.length > 8 ? item.title.substr(0, 8) + "..." : item.title) : ""}</td>
                            <td>{item.is_read}</td>
                            <td>
                                <span onClick={this.getMessageInfo.bind(this, item.id)}>查看</span>
                            </td>
                        </tr>
                    );
                }
            }
            return views;
        }
        return <tr><td colSpan="5" style={{ paddingTop: '2vh' }}><Empty description={<font style={{ color: '#FFF' }}>暂无数据</font>} /></td></tr>;
    }
    


    render() {
        const { myMessageBox, loading, messageType } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'50vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={myMessageBox}
                onCancel={() => this.hideMyMessageBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.rechargeRecordBox}>
                        <div className={styles.rechargeRecordBody}>
                            <div className={styles.rechargeRecordBodyBox}>
                                <div className={styles.rechargeRecordBodyBoxTitle}>站内信</div>
                                <div className={styles.rechargeRecordBodyBoxBody}>
                                    {this.state.agentId !== '' ?
                                        <div className={styles.rechargeRecordBodyBoxButton}>
                                            <span onClick={() => this.onChangeRechargeType(1)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.messageType === 1 && styles.rechargeBodyBoxBodyRechargeBodyTypeHover].join(' ')}>收件箱</span>
                                            <span onClick={() => this.onChangeRechargeType(2)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.messageType === 2 && styles.rechargeBodyBoxBodyRechargeBodyTypeHover].join(' ')}>发件箱</span>
                                        </div>
                                        :
                                        null
                                    }
                                    <table>
                                        <thead>
                                            {messageType === 1 ?
                                                <tr>
                                                    <th>时间</th>
                                                    <th>发送人</th>
                                                    <th >标题</th>
                                                    <th>状态</th>
                                                    <th>操作</th>
                                                </tr>
                                                :
                                                <tr>
                                                    <th>时间</th>
                                                    <th>收件人</th>
                                                    <th>标题</th>
                                                    <th>状态</th>
                                                    <th>操作</th>
                                                </tr>
                                            }
                                        </thead>
                                        <tbody>
                                            {this.renderMessageList()}
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    this.state.messageCount <= this.state.pageSize ?
                                        null :
                                        <PaginationView Total={this.state.messageCount} pageSize={this.state.pageSize} pageNum={this.state.pageNum} onNextPage={this.onNextPage} onPrePage={this.onPrePage} />
                                }

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
        myMessageBox: state.message.myMessageBox,
        messageType: state.message.messageType,
        loading: state.loading.effects['message/getMessageList'] || false
    }
}

export default connect(mapStateToProps)(MyMessageView);