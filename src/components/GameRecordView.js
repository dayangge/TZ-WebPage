import { connect } from 'dva';
import { Modal, Spin, DatePicker, Select, Button, Empty } from 'antd';
import moment from 'moment';
import styles from '../style/rechargeRecordView.css';
import PaginationView from 'components/PaginationView';
const Option = Select.Option;
class GameRecordView extends React.Component {
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
            gameRecordCount: 0
        }
    }

    componentDidMount() {
        this.onGetGameRecordList();
        this.onGetGameList();
    }

    onGetGameList() {
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
        params.pageSize = this.state.pageSize;
        params.pageIndex = this.state.pageNum;
        this.props.dispatch({
            type: 'gameRecord/getGameRecordList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        gameRecordList: res.list,
                        gameRecordCount: res.count
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

    hideGameRecordView() {
        this.props.dispatch({
            type: 'gameRecord/changeGameRecordBox',
            payload: false
        });
    }

    showChannelList() {
        if (this.state.gameList.length === 0) {
            return null;
        } else {
            let views = [];
            let channelList = this.state.gameList;
            for (let i = 0; i < channelList.length; i++) {
                let channelItem = channelList[i];
                views.push(<Option key={channelItem.id} value={channelItem.id}>{channelItem.game_name}</Option>);
            }
            return views;
        }
    }

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
            <div className={styles.rechargeRecordBodyBoxBodyHeader}>
                <div className={styles.rechargeRecordBodyBoxBodyTitle}>
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
                    <Button className={styles.rechargeRecordBodySearch} onClick={() => { this.setState({ pageNum: 1 }, () => { this.onGetGameRecordList() }) }}>提 交</Button>
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
                        <td>{item.gameTime}</td>
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
        const { gameRecordBox, loading } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'60vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={gameRecordBox}
                onCancel={() => this.hideGameRecordView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.rechargeRecordBox}>
                        <div className={styles.rechargeRecordBody}>
                            <div className={styles.rechargeRecordBodyBox}>
                                <div className={styles.rechargeRecordBodyBoxTitle}>游戏记录</div>
                                <div className={styles.rechargeRecordBodyBoxBody}>
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
        gameRecordBox: state.gameRecord.gameRecordBox,
        loading: state.loading.effects['gameRecord/getGameRecordList'] || false
    }
}

export default connect(mapStateToProps)(GameRecordView);