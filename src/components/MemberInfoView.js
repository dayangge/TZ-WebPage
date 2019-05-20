import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, DatePicker, Select, Button, Empty } from 'antd';
import styles from '../style/memberInfo.css';
import PaginationView from 'components/PaginationView';
import moment from 'moment';
const Option = Select.Option;
class MemberInfoView extends Component {
    constructor() {
        super();
        this.state = {
            gameList: [],
            gameId: null,
            beginday: null,
            endday: null,
            pageNum: 1,
            pageSize: 8,
            gameRecordList: [],
            gameRecordCount: 0,
            gameRecordInfo:null
        }
    }

    componentDidMount() {
        this.onGetGameRecordList();
        this.onGetGameList();
        // this.onGetMemberInfo();
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
    onGetGameList() {
        let params = {};
        params.msgId = this.props.messageId;
        this.props.dispatch({
            type: 'game/getGameAllList',
            payload: null,
            callback: (res) => {
                
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        gameList: res
                    });
                }
            }
        });
    }

    // onGetMemberInfo() {     //消息
    //     let params = {};
    //     params.msgId = this.props.messageId;
    //     this.props.dispatch({
    //         type: 'message/getMemberInfo',
    //         payload: null,
    //         callback: (res) => {
    //             if (res.errorCode && res.errorCode !== 1) {
    //             } else {
    //                 this.setState({
    //                     memberInfo: res
    //                 });
    //             }
    //         }
    //     });
    // }

    onGetGameRecordList() {
        let params = {};
        if (this.state.beginday !== null && this.state.beginday !== "") {
            params.beginday = this.state.beginday;
        }
        if (this.state.endday !== null && this.state.endday !== "") {
            params.endday = this.state.endday;
        }
        if (this.state.gameId !== null && this.state.gameId !== "" && this.state.gameId !== undefined) {
            params.gameId = this.state.gameId;
        }
        params.user_id = this.props.messageId;
        params.pageSize = this.state.pageSize;
        params.pageIndex = this.state.pageNum;
        this.props.dispatch({
            type: 'gameRecord/getGameRecordListInfo',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        gameRecordList: res.gameRecord.list,
                        gameRecordCount: res.gameRecord.count,
                        gameRecordInfo:res.userInfo
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
                this.onGetGameRecordList();
            })
        }
    }

    onNextPage = () => {
        let pageTotal = Math.ceil(this.state.gameRecordCount / this.state.pageSize);
        if (this.state.pageNum >= pageTotal) {
            return false;
        } else {
            this.setState({
                pageNum: this.state.pageNum + 1
            }, () => {
                this.onGetGameRecordList();
            })
        }
    }

    hideMemberRecordBox() {
        this.props.dispatch({
            type: 'message/changeMemberGainsBox',
            payload: false
        });
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
            payload: true
        });

    }
    // showChannelList() {
    //     if (this.state.gameList.length === 0) {
    //         return null;
    //     } else {
    //         let views = [];
    //         let channelList = this.state.gameList;
    //         for (let i = 0; i < channelList.length; i++) {
    //             let channelItem = channelList[i];
    //             views.push(<Option key={channelItem.id} value={channelItem.id}>{channelItem.game_name}</Option>);
    //         }
    //         return views;
    //     }
    // }

    chooseGame(value) {
        this.setState({
            gameId: value
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

    showGameList() {
        if (this.state.gameList.length === 0) {
            return null;
        } else {
            let views = [];
            let gameList = this.state.gameList;
            for (let i = 0; i < gameList.length; i++) {
                let gameItem = gameList[i];
                views.push(<Option key={gameItem.id} value={gameItem.id}>{gameItem.game_name}</Option>);
            }
            return views;
        }
    }

    renderRechargeRecordHeader() {
        return (
            <div className={styles.memberInfoBodyBoxBodyHeader}>
                <div className={styles.menberRecordBodyBoxBodyTitle}>
                    <span >开始时间：</span>
                    <DatePicker disabledDate={this.disabledStartDate} onChange={this.onStarDataChange.bind(this)} placeholder="选择开始时间" style={{ cursor: 'pointer' }} />
                </div>
                <div>
                    <span>结束时间：</span>
                    <DatePicker disabledDate={this.disabledEndDate} onChange={this.onEndDataChange.bind(this)} placeholder="选择结束时间" style={{ cursor: 'pointer' }} />
                </div>
                <div>
                    <span>游戏类型：</span>
                    <Select placeholder="请选择游戏类型" style={{ width: 177 }} onChange={this.chooseGame.bind(this)} allowClear>
                        {this.showGameList()}
                    </Select>
                </div>
                <div>
                    <Button className={styles.menberRecordBodySearch} onClick={() => { this.setState({ pageNum: 1 }, () => { this.onGetGameRecordList() }) }}>提 交</Button>
                </div>
            </div>
        )
    }

    renderGameRecordList() {
        if (this.state.gameRecordList.length > 0) {
            let gameRecordList = this.state.gameRecordList;
            let views = [];
            for (let i = 0; i < gameRecordList.length; i++) {
                const item = gameRecordList[i];
                views.push(
                    <tr key={i}>
                        <td>{item.channel}</td>
                        <td>{item.game}</td>
                        <td>{item.gid}</td>
                        <td>{item.end_game_time}</td>
                        <td>{item.score}</td>
                        <td>{item.sys_recv}</td>
                        <td>{item.money}</td>
                    </tr>
                )
            }
            return views;
        } else {
            return <tr><td colSpan="7" style={{ paddingTop: '2vh' }}><Empty description={<font style={{ color: '#FFF' }}>暂无数据</font>} /></td></tr>;
        }
    }

    render() {
        const { memberRecordBox, loading } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'50vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={memberRecordBox}
                onCancel={() => this.hideMemberRecordBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.memberInfoBox}>
                        <div className={styles.memberInfoBody}>
                            <div className={styles.memberInfoBodyBox}>
                                <div className={styles.memberInfoBodyBoxTitle}>会员资料</div>
                                <div className={styles.memberInfoBodyBoxBody}>
                                <div className={styles.memberInfoBodyBoxBodyInfo}>
                                    <div className={styles.memberInfoBodyBoxBodyInfoContent}>
                                        <div className={styles.memberInfoBodyBoxBodyInfoContentInfo}>
                                            <span>昵称：</span>
                                            <span>{this.state.gameRecordInfo === null ? null : this.state.gameRecordInfo.nickname}</span>
                                        </div>
                                        <div className={styles.memberInfoBodyBoxBodyInfoContentInfo}>
                                            <span>账户：</span>
                                            <span>{this.state.gameRecordInfo === null ? null : this.state.gameRecordInfo.account}</span>
                                        </div>
                                        <div className={styles.memberInfoBodyBoxBodyInfoContentInfo}>
                                            <span>金额：</span>
                                            <span>{this.state.gameRecordInfo === null ? null : this.state.gameRecordInfo.total}元</span>
                                        </div>
                                        <div className={styles.memberInfoBodyBoxBodyInfoContentInfo}>
                                            <span>团队人数：</span>
                                            <span>{this.state.gameRecordInfo === null ? null : this.state.gameRecordInfo.group_num}人</span>
                                        </div>
                                    </div>
                                    <div className={styles.memberInfoBodyBoxBodyInfoContent}>
                                    <div className={styles.memberInfoBodyBoxBodyInfoContentInfo}>
                                            <span>开户时间：</span>
                                            <span>{this.state.gameRecordInfo === null ? null : this.state.gameRecordInfo.add_time}</span>
                                        </div>
                                        <div className={styles.memberInfoBodyBoxBodyInfoContentInfo}>
                                            <span>活跃时间：</span>
                                            <span>{this.state.gameRecordInfo === null ? null : this.state.gameRecordInfo.last_login_time}</span>
                                        </div>
                                        <div className={styles.memberInfoBodyBoxBodyInfoContentInfo}>
                                            <span>来源：</span>
                                            <span>{this.state.gameRecordInfo === null ? null : this.state.gameRecordInfo.from}</span>
                                        </div>
                                    </div>
                                </div>
                                      {this.renderRechargeRecordHeader()}
                                <table>
                                        <thead>
                                            <tr>
                                                <th>交易名称</th>
                                                <th>游戏类型</th>
                                                <th>牌局编号</th>
                                                <th>输赢时间</th>
                                                <th>输赢金额</th>
                                                <th>抽水额度</th>
                                                <th>实际获得</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderGameRecordList()}
                                        </tbody>
                                    </table>
                                    {
                                        this.state.gameRecordCount <= this.state.pageSize ?
                                            null :
                                            <PaginationView Total={this.state.gameRecordCount} pageSize={this.state.pageSize} pageNum={this.state.pageNum} onNextPage={this.onNextPage} onPrePage={this.onPrePage} />
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
        messageId: state.message.messageId,
        memberRecordBox: state.message.memberRecordBox,
        loading: state.loading.effects['gameRecord/getGameRecordListInfo','game/getGameAllList'] || false
    }
}

export default connect(mapStateToProps)(MemberInfoView);