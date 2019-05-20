import { connect } from 'dva';
import { Modal, Spin, DatePicker, Select, Button, Empty } from 'antd';
import moment from 'moment';
import styles from '../style/rechargeRecordView.css';
import PaginationView from 'components/PaginationView';
const Option = Select.Option;
class WithdrawalsRecordView extends React.Component {
    constructor() {
        super();
        this.state = {
            beginday: null,
            endday: null,
            status: null,
            pageNum: 1,
            pageSize: 8,
            withdrawalsRecordList: [],
            withdrawalsRecordCount: 0
        }
    }

    componentDidMount() {
        this.onGetWithdrawalsRecordList();
    }

    onGetWithdrawalsRecordList() {
        let params = {};
        if (this.state.beginday !== null && this.state.beginday !== "") {
            params.beginday = this.state.beginday;
        }
        if (this.state.endday !== null && this.state.endday !== "") {
            params.endday = this.state.endday;
        }
        if (this.state.status !== null && this.state.status !== "" && this.state.status !== "0") {
            params.status = this.state.status;
        }
        params.page_size = this.state.pageSize;
        params.page = this.state.pageNum;
        this.props.dispatch({
            type: 'withdrawals/getWithdrawalsRecordList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        withdrawalsRecordList: res.list,
                        withdrawalsRecordCount: res.count
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
                this.onGetWithdrawalsRecordList();
            })
        }
    }

    onNextPage = () => {
        let pageTotal = Math.ceil(this.state.withdrawalsRecordCount / this.state.pageSize);
        if (this.state.pageNum >= pageTotal) {
            return false;
        } else {
            this.setState({
                pageNum: this.state.pageNum + 1
            }, () => {
                this.onGetWithdrawalsRecordList();
            })
        }
    }

    hideWithdrawalsRecordBox() {
        this.props.dispatch({
            type: 'withdrawals/changeWithdrawalsRecordBox',
            payload: false
        });
    }


    chooseStatus(value) {
        this.setState({
            status: value
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

    renderWithdrawalsRecordHeader() {
        return (
            <div className={styles.rechargeRecordBodyBoxBodyHeader}>
                <div className={styles.rechargeRecordBodyBoxBodyTitle}>
                    <span >开始时间：</span>
                    <DatePicker disabledDate={this.disabledStartDate} placeholder="选择开始时间" onChange={this.onStarDataChange.bind(this)} style={{ cursor: 'pointer' }} allowClear />
                </div>
                <div>
                    <span>结束时间：</span>
                    <DatePicker disabledDate={this.disabledEndDate} placeholder="选择结束时间" onChange={this.onEndDataChange.bind(this)} style={{ cursor: 'pointer' }} allowClear />
                </div>
                <div>
                    <span>状态：</span>
                    <Select placeholder="请选择状态" style={{ width: 177 }} onChange={this.chooseStatus.bind(this)} allowClear>
                        <Option value="0">所有的</Option>
                        <Option value="1">进行中</Option>
                        <Option value="2">失败</Option>
                        <Option value="3">成功</Option>
                    </Select>
                </div>
                <div>
                    <Button className={styles.rechargeRecordBodySearch} onClick={() => { this.setState({ pageNum: 1 }, () => { this.onGetWithdrawalsRecordList() }) }}>提 交</Button>
                </div>
            </div>
        )
    }

    renderWithdrawalsRecordList() {
        if (this.state.withdrawalsRecordList.length > 0) {
            let withdrawalsRecordList = this.state.withdrawalsRecordList;
            let views = [];
            for (let i = 0; i < withdrawalsRecordList.length; i++) {
                const item = withdrawalsRecordList[i];
                views.push(
                    <tr key={i}>
                        <td>{item.ordernum}</td>
                        <td>{item.trantype}</td>
                        <td>{item.money}</td>
                        <td>{item.status}</td>
                        <td>{item.add_time}</td>
                    </tr>
                )
            }
            return views;
        } else {
            return <tr><td colSpan="5" style={{ paddingTop: '2vh' }}><Empty description={<font style={{ color: '#FFF' }}>暂无数据</font>} /></td></tr>;
        }
    }

    render() {
        const { withdrawalsRecordBox, loading } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'50vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={withdrawalsRecordBox}
                onCancel={() => this.hideWithdrawalsRecordBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.rechargeRecordBox}>
                        <div className={styles.rechargeRecordBody}>
                            <div className={styles.rechargeRecordBodyBox}>
                                <div className={styles.rechargeRecordBodyBoxTitle}>提现记录</div>
                                <div className={styles.rechargeRecordBodyBoxBody}>
                                    {this.renderWithdrawalsRecordHeader()}
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>交易编号</th>
                                                <th>交易类型</th>
                                                <th>交易金额</th>
                                                <th>状态</th>
                                                <th>操作时间</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderWithdrawalsRecordList()}
                                        </tbody>
                                    </table>
                                    {
                                        this.state.withdrawalsRecordCount <= this.state.pageSize ?
                                            null :
                                            <PaginationView Total={this.state.withdrawalsRecordCount} pageSize={this.state.pageSize} pageNum={this.state.pageNum} onNextPage={this.onNextPage} onPrePage={this.onPrePage} />
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
        withdrawalsRecordBox: state.withdrawals.withdrawalsRecordBox,
        loading: state.loading.effects['withdrawals/getWithdrawalsRecordList'] || false
    }
}

export default connect(mapStateToProps)(WithdrawalsRecordView);