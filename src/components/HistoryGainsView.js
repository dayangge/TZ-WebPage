import { connect } from 'dva';
import { Modal, Spin, Empty } from 'antd';
import styles from '../style/rechargeRecordView.css';
import PaginationView from 'components/PaginationView';
class HistoryGainsView extends React.Component {
    constructor() {
        super();
        this.state = {
            pageNum: 1,
            pageSize: 8,
            historyGainsList: [],
            historyGainsCount: 0
        }
    }

    componentDidMount() {
        this.onGetHistoryGainsList();
    }

    onGetHistoryGainsList() {
        let params = {};
        params.page_size = this.state.pageSize;
        params.page = this.state.pageNum;
        this.props.dispatch({
            type: 'agency/getHistoryGainsList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        historyGainsList: res.list,
                        historyGainsCount: res.count
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
                this.onGetHistoryGainsList();
            })
        }
    }

    onNextPage = () => {
        let pageTotal = Math.ceil(this.state.historyGainsCount / this.state.pageSize);
        if (this.state.pageNum >= pageTotal) {
            return false;
        } else {
            this.setState({
                pageNum: this.state.pageNum + 1
            }, () => {
                this.onGetHistoryGainsList();
            })
        }
    }

    hideHistoryGainsBox() {
        this.props.dispatch({
            type: 'agency/changeHistoryGainsBox',
            payload: false
        });
        this.props.dispatch({
            type: 'agency/changeAgencyRelationshipBox',
            payload: true
        });
    }

    renderHistoryGainsList() {
        if (this.state.historyGainsList.length > 0) {
            let historyGainsList = this.state.historyGainsList;
            let views = [];
            for (let i = 0; i < historyGainsList.length; i++) {
                const item = historyGainsList[i];
                views.push(
                    <tr key={i}>
                        <td>{item.time}</td>
                        <td>{item.zhijie}</td>
                        <td>{item.jianjie}</td>
                        <td>{item.money}</td>
                    </tr>
                );
            }
            return views;
        } else {
            return <tr><td colSpan="4" style={{ paddingTop: '2vh' }}><Empty description={<font style={{ color: '#FFF' }}>暂无数据</font>} /></td></tr>;
        }
    }

    render() {
        const { historyGainsBox, loading } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'50vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={historyGainsBox}
                onCancel={() => this.hideHistoryGainsBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.rechargeRecordBox}>
                        <div className={styles.rechargeRecordBody}>
                            <div className={styles.rechargeRecordBodyBox}>
                                <div className={styles.rechargeRecordBodyBoxTitle}>历史收益</div>
                                <div className={styles.rechargeRecordBodyBoxBody}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>时间</th>
                                                <th>下级收益</th>
                                                <th>其他收益</th>
                                                <th>总收益</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderHistoryGainsList()}
                                        </tbody>
                                    </table>
                                    {
                                        this.state.historyGainsCount <= this.state.pageSize ?
                                            null :
                                            <PaginationView Total={this.state.historyGainsCount} pageSize={this.state.pageSize} pageNum={this.state.pageNum} onNextPage={this.onNextPage} onPrePage={this.onPrePage} />
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
        historyGainsBox: state.agency.historyGainsBox,
        loading: state.loading.effects['agency/getHistoryGainsList'] || false
    }
}

export default connect(mapStateToProps)(HistoryGainsView);