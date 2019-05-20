import { connect } from 'dva';
import { Modal, Spin, DatePicker, Button, Input, Empty, notification } from 'antd';
import moment from 'moment';
import styles from 'style/agencyRelationship.css';
import PaginationView from 'components/PaginationView';
import copy from 'copy-to-clipboard';
import storage from 'utils/localStorage';
class AgencyRelationshipView extends React.Component {
    constructor() {
        super();
        this.state = {
            beginday: null,
            endday: null,
            account: null,
            pageNum: 1,
            pageSize: 8,
            agencyList: [],
            agencyCount: 0,
            userisAgent: null,
            agentId: null,
            officialUrl: null
        }
    }

    componentDidMount() {
        this.onGetAgencyList();
        let userInfoString = storage.get('user');
        let userInfoObject = JSON.parse(userInfoString);
        this.setState({
            officialUrl: userInfoObject.official_url,
        })
    }

    onGetAgencyList() {
        let params = {};
        if (this.state.account !== null && this.state.account !== "") {
            params.account = this.state.account
        }
        if (this.state.beginday !== null && this.state.beginday !== "") {
            params.beginday = this.state.beginday;
        }
        if (this.state.endday !== null && this.state.endday !== "") {
            params.endday = this.state.endday;
        }
        params.page_size = this.state.pageSize;
        params.page = this.state.pageNum;
        this.props.dispatch({
            type: 'agency/getAgencyList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        agencyList: res.list,
                        agencyCount: res.count,
                        userisAgent: res.isAgent,
                        agentId: res.agentId,
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
                this.onGetAgencyList();
            })
        }
    }

    onNextPage = () => {
        let pageTotal = Math.ceil(this.state.agencyCount / this.state.pageSize);
        if (this.state.pageNum >= pageTotal) {
            return false;
        } else {
            this.setState({
                pageNum: this.state.pageNum + 1
            }, () => {
                this.onGetAgencyList();
            })
        }
    }

    hideAgencyRelationshipBox() {
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
            payload: false
        });
    }
    onStarDataChange(date, dateString) {
        this.setState({
            beginday: dateString
        });
    }

    onEndDataChange(date, dateString) {
        this.setState({
            endday: dateString
        });
    }
    handleAgentClick = () => {
        document.execCommand("copy");
        if (copy("http://" + this.state.officialUrl + "/?agent_id=" + this.state.agentId)) {
            notification.success({
                message: `复制成功`,
            });
        } else {
            notification.error({
                message: `复制失败`,
            });
        }
    }
    onShowHistoryGains() {
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
            payload: false
        });
        this.props.dispatch({
            type: 'agency/changeHistoryGainsBox',
            payload: true
        });
    }

    onShowAgencyRule() {
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
            payload: false
        });
        this.props.dispatch({
            type: 'agency/changeAgencyRuleBox',
            payload: true
        });
    }

    disabledStartDate = (current) => {
        return current && current > moment().endOf('day');
    }
    disabledEndDate = (current) => {
        if (current > moment().endOf('day') || current < moment(this.state.beginday)) {
            return true;
        } else {
            return false;
        }
    }

    renderRechargeRecordHeader() {
        if (this.state.userisAgent === 1) {
            return (
                <div className={styles.rechargeRecordBodyBoxBodyBox}>
                    <div className={styles.rechargeRecordBodyBoxBodyHeader}>
                        <div>
                            <span >开始时间：</span>
                            <DatePicker disabledDate={this.disabledStartDate} placeholder="选择开始时间" style={{ cursor: 'pointer' }} onChange={this.onStarDataChange.bind(this)} allowClear />
                        </div>
                        <div>
                            <span>结束时间：</span>
                            <DatePicker disabledDate={this.disabledEndDate} placeholder="选择结束时间" style={{ cursor: 'pointer' }} onChange={this.onEndDataChange.bind(this)} allowClear />
                        </div>
                        <div className={styles.agencyRelationship}>
                            <span>用户名：</span>
                            <Input placeholder="请搜索用户名" onChange={e => { this.setState({ account: e.target.value }) }} autoComplete="off" type="text" />
                        </div>
                        <div className={styles.agencyRelationshipSearch}>
                            <Button onClick={() => { this.setState({ pageNum: 1 }, () => { this.onGetAgencyList() }) }}>搜 索</Button>
                            <Button onClick={() => { this.onShowHistoryGains() }}>历史收益</Button>
                        </div>
                    </div>
                    <div className={styles.agencyRelationshipAgent}>
                        <div className={styles.agencyRelationshipAgentId}>
                            <span>您的代理ID：</span>
                            <span>{this.state.agentId}</span>
                        </div>
                        <div className={styles.agencyRelationshipAgentCopy}>
                            <span>邀请链接：</span>
                            <span>{"http://" + this.state.officialUrl + "/?agent_id=" + this.state.agentId}</span>
                            <span onClick={this.handleAgentClick}>点击复制</span>
                        </div>
                    </div>
                </div>

            )
        } else {
            return (
                <div className={styles.rechargeRecordBodyBoxBodyHeader}>
                    <div>
                        <span >开始时间：</span>
                        <DatePicker disabledDate={this.disabledStartDate} placeholder="选择开始时间" style={{ cursor: 'pointer' }} onChange={this.onStarDataChange.bind(this)} allowClear />
                    </div>
                    <div>
                        <span>结束时间：</span>
                        <DatePicker disabledDate={this.disabledEndDate} placeholder="选择结束时间" style={{ cursor: 'pointer' }} onChange={this.onEndDataChange.bind(this)} allowClear />
                    </div>
                    <div className={styles.agencyRelationship}>
                        <span>用户名：</span>
                        <Input placeholder="请搜索用户名" onChange={e => { this.setState({ account: e.target.value }) }} autoComplete="off" type="text" />
                    </div>
                    <div className={styles.agencyRelationshipSearch}>
                        <Button onClick={() => { this.setState({ pageNum: 1 }, () => { this.onGetAgencyList() }) }}>搜 索</Button>
                        <Button onClick={() => { this.onShowAgencyRule() }}>成为代理</Button>
                    </div>
                </div>
            )
        }
    }



    toDownAgencyTransfer(Account) {   //转账
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
            payload: false
        });
        this.props.dispatch({
            type: 'agency/changeAgencyTransferBox',
            payload: true
        });
        this.props.dispatch({
            type: 'agency/changeAgencyTransferInfo',
            payload: Account
        });
    }

    onClickSendToUser(userId, Account) {  //发送消息
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
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
    showUserInfo(msgId) {   //详情
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
            payload: false
        });
        let obj = {};
        obj.mesId = msgId;
        this.props.dispatch({
            type: 'message/changeMessageId',
            payload: obj
        });
        this.props.dispatch({
            type: 'message/changeMessageType',
            payload: 1
        });
        this.props.dispatch({
            type: 'message/changeMemberGainsBox',
            payload: true
        });
    }
    renderAgencyList() {  //内容
        if (this.state.agencyList.length > 0) {
            let agencyList = this.state.agencyList;
            let views = [];
            for (let i = 0; i < agencyList.length; i++) {
                const item = agencyList[i];
                views.push(
                    <tr key={i}>
                        <td>{item.account}</td>
                        <td>{item.nickname}</td>
                        <td>{item.last_login_time}</td>
                        <td>{item.addtime}</td>
                        <td>
                            <span onClick={this.showUserInfo.bind(this, item.user_id)}>详情</span>
                            <span onClick={this.toDownAgencyTransfer.bind(this, item.account)}>转账</span>
                            <span onClick={this.onClickSendToUser.bind(this, item.user_id, item.account)}>发送消息</span>
                        </td>
                    </tr>
                )
            }
            return views;
        } else {
            return <tr><td colSpan="5" style={{ paddingTop: '2vh' }}><Empty description={<font style={{ color: '#FFF' }}>暂无数据</font>} /></td></tr>;
        }
    }

    render() {
        const { agencyRelationshipBox, loading } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'60vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={agencyRelationshipBox}
                onCancel={() => this.hideAgencyRelationshipBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.rechargeRecordBox}>
                        <div className={styles.rechargeRecordBody}>
                            <div className={styles.rechargeRecordBodyBox}>
                                <div className={styles.rechargeRecordBodyBoxTitle}>代理关系</div>
                                <div className={styles.rechargeRecordBodyBoxBody}>
                                    {this.renderRechargeRecordHeader()}
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>用户名</th>
                                                <th>昵称</th>
                                                <th>最后登录时间</th>
                                                <th>注册时间</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderAgencyList()}
                                        </tbody>
                                    </table>
                                    {
                                        this.state.agencyCount <= this.state.pageSize ?
                                            null :
                                            <PaginationView Total={this.state.agencyCount} pageSize={this.state.pageSize} pageNum={this.state.pageNum} onNextPage={this.onNextPage} onPrePage={this.onPrePage} />
                                    }
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
        agencyRelationshipBox: state.agency.agencyRelationshipBox,
        loading: state.loading.effects['agency/getAgencyList'] || false
    }
}

export default connect(mapStateToProps)(AgencyRelationshipView);