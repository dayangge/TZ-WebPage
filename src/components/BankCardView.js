import { connect } from 'dva';
import { Modal, Spin, Empty, Button } from 'antd';
import styles from '../style/rechargeRecordView.css';
import PaginationView from 'components/PaginationView';
class BankCardView extends React.Component {
    constructor() {
        super();
        this.state = {
            pageNum: 1,
            pageSize: 8,
            bankCardList: [],
            bankCardCount: 0
        }
    }

    componentDidMount() {
        this.onGetBankCardList();
    }

    onGetBankCardList() {
        let params = {};
        params.page_size = this.state.pageSize;
        params.page = this.state.pageNum;
        this.props.dispatch({
            type: 'bankCard/getBankCardList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        bankCardList: res.list,
                        bankCardCount: res.count
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
                this.onGetBankCardList();
            })
        }
    }

    onNextPage = () => {
        let pageTotal = Math.ceil(this.state.bankCardCount / this.state.pageSize);
        if (this.state.pageNum >= pageTotal) {
            return false;
        } else {
            this.setState({
                pageNum: this.state.pageNum + 1
            }, () => {
                this.onGetBankCardList();
            })
        }
    }

    hideBankCardBox() {
        this.props.dispatch({
            type: 'bankCard/changeBankCardBox',
            payload: false
        });
    }

    showAddBankCard() {   //添加银行卡
        this.props.dispatch({
            type: 'bankCard/changeBankCardBox',
            payload: false
        });
        this.props.dispatch({
            type: 'bankCard/changeAddBankCardBox',
            payload: true
        });
    }

    renderBankCardList() {
        if (this.state.bankCardList.length > 0) {
            let bankCardList = this.state.bankCardList;
            let views = [];
            for (let i = 0; i < bankCardList.length; i++) {
                const item = bankCardList[i];
                views.push(
                    <tr key={i}>
                        <td>{item.bank_name}</td>
                        <td>{item.username}</td>
                        <td>{item.account}</td>
                        <td>{item.status}</td>
                        <td>{item.addtime}</td>
                    </tr>
                );
            }
            return views;
        } else {
            return <tr><td colSpan="5" style={{ paddingTop: '2vh' }}><Empty description={<font style={{ color: '#FFF' }}>暂无数据</font>} /></td></tr>;
        }
    }

    render() {
        const { bankCardBox, loading } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'50vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={bankCardBox}
                onCancel={() => this.hideBankCardBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.rechargeRecordBox}>
                        <div className={styles.rechargeRecordBody}>
                            <div className={styles.rechargeRecordBodyBox}>
                                <div className={styles.rechargeRecordBodyBoxTitle}>银行卡</div>
                                <div className={styles.rechargeRecordBodyBoxBody}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, width: '100%', alignItems: 'center' }}>
                                        <span style={{ color: '#FFF' }}>如需更改银行卡信息，需提供相关凭据联系客服修改；请勿使用信用卡进行绑定</span>
                                        <Button style={{ color: '#FFF',background: '#8da4ea', border:0}}  onClick={() => { this.showAddBankCard() }}>+添加银行卡</Button>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>开户行</th>
                                                <th>姓名</th>
                                                <th>卡号</th>
                                                <th>状态</th>
                                                <th>添加时间</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderBankCardList()}
                                        </tbody>
                                    </table>
                                    {
                                        this.state.bankCardList <= this.state.pageSize ?
                                            null :
                                            <PaginationView Total={this.state.bankCardCount} pageSize={this.state.pageSize} pageNum={this.state.pageNum} onNextPage={this.onNextPage} onPrePage={this.onPrePage} />
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
        bankCardBox: state.bankCard.bankCardBox,
        loading: state.loading.effects['bankCard/getBankCardList'] || false
    }
}

export default connect(mapStateToProps)(BankCardView);