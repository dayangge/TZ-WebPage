import { connect } from 'dva';
import { Modal, Spin } from 'antd';
import styles from '../style/initiation.css';
import storage from '../utils/localStorage';
class InitiationView extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {

    }

    hideWithdrawSureInfoBox() {
        this.props.dispatch({
            type: 'withdrawals/changeWithdrawSureInfoBox',
            payload: false
        });
        this.props.dispatch({
            type: 'withdrawals/changeWithdrawSureInfo',
            payload: null
        });
        this.props.dispatch({
            type: 'withdrawals/changeCashWithdrawalBox',
            payload: true
        });
    }

    handleSubmit = (e) => {
        this.props.dispatch({
            type: 'withdrawals/addCashWithdrawal',
            payload: this.props.withdraSureInfo,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                    return false;
                } else {
                    let userInfoString = storage.get('user');
                    let userInfoObject = JSON.parse(userInfoString);
                    userInfoObject.total = res;
                    storage.add('user', userInfoObject);
                    this.props.dispatch({
                        type: 'withdrawals/changeWithdrawSureInfoBox',
                        payload: false
                    });
                    this.props.dispatch({
                        type: 'withdrawals/changeWithdrawSureInfo',
                        payload: null
                    });
                    this.props.dispatch({
                        type: 'withdrawals/changeWithdrawalsRecordBox',
                        payload: true
                    });
                }
            }
        });
    }

    render() {
        const { withdrawSureInfoBox, loading, withdraSureInfo } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={withdrawSureInfoBox}
                onCancel={() => this.hideWithdrawSureInfoBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.initiationBox}>
                        <div className={styles.initiationBody}>
                            <div className={styles.initiationBodyBox}>
                                <div className={styles.initiationBodyBoxTitle}>发起提现</div>
                                <div className={styles.initiationBodyBoxBody}>
                                    <div className={styles.initiationBodyBoxBodyInfo}>
                                        <span>提现金额：</span>
                                        <span>{withdraSureInfo.money}</span>
                                    </div>
                                    <div className={styles.initiationBodyBoxBodyInfo}>
                                        <span>行政手续费：</span>
                                        <span>{withdraSureInfo.service_money}</span>
                                    </div>
                                    <div className={styles.initiationBodyBoxBodyInfo}>
                                        <span>实际到账：</span>
                                        <span>{withdraSureInfo.actual_money}</span>
                                    </div>
                                    <div className={styles.initiationBodyBoxButton}>
                                        <span onClick={this.handleSubmit} className={styles.initiationLoginButton}>确认提现</span>
                                        <span onClick={() => this.hideWithdrawSureInfoBox()} className={styles.initiationRegisterButton}>取消</span>
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
        withdrawSureInfoBox: state.withdrawals.withdrawSureInfoBox,
        loading: state.loading.effects['withdrawals/addCashWithdrawal'] || false,
        withdraSureInfo: state.withdrawals.withdraSureInfo
    }
}

export default connect(mapStateToProps)(InitiationView);