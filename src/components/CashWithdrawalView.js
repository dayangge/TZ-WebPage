import { connect } from 'dva';
import { Modal, Spin, Input, Form } from 'antd';
import styles from 'style/loginView.css';
class CashWithdrawalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            cashWithdrawalInfo: null
        }
    }

    componentDidMount() {
        this.onGetCashWithdrawalInfo();
    }

    onGetCashWithdrawalInfo() {
        this.props.dispatch({
            type: 'withdrawals/getCashWithdrawalInfo',
            payload: null,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        cashWithdrawalInfo: res
                    });
                }
            }
        });
    }

    hideCashWithdrawalView() {
        this.props.dispatch({
            type: 'withdrawals/changeCashWithdrawalBox',
            payload: false
        });
    }


    validMoney = (rule, value, callback) => {
        if (_.toInteger(value) < 100 || _.toInteger(value) > 49999) {
            callback('最小100.00元，最大49,999.00元。');
        } else if (this.state.cashWithdrawalInfo && _.toInteger(value) > _.toInteger(this.state.cashWithdrawalInfo.total)) {
            callback('可用余额不足。');
        } else {
            callback();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.bank_id = this.state.cashWithdrawalInfo.id;
                if(this.state.cashWithdrawalInfo.username===null || this.state.cashWithdrawalInfo.username===undefined||this.state.cashWithdrawalInfo.username===''){
                    this.props.dispatch({
                        type: 'withdrawals/changeCashWithdrawalBox',
                        payload: false
                    });
                    this.props.dispatch({
                        type: 'bankCard/changeBankCardBox',
                        payload: true
                    });
                }
                this.props.dispatch({
                    type: 'withdrawals/getWithdrawSureInfo',
                    payload: values,
                    callback: (res) => {
                        if (res && res.errorCode) {
                            this.props.form.setFields({
                                draw_pwd: {
                                    value: values.draw_pwd,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                        } else {
                            this.props.dispatch({
                                type: 'withdrawals/changeCashWithdrawalBox',
                                payload: false
                            });
                            this.props.dispatch({
                                type: 'withdrawals/changeWithdrawSureInfoBox',
                                payload: true
                            });
                        }
                    }
                });
            
        }
        });
    }


    render() {
        const { cashWithdrawalBox, loading, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={cashWithdrawalBox}
                onCancel={() => this.hideCashWithdrawalView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <Form>
                        <div className={styles.loginBox}>
                            <div className={styles.loginBody}>
                                <div className={styles.loginBodyBox}>
                                    <div className={styles.loginBodyBoxTitle}>快速提现</div>
                                    <div className={styles.loginBodyBoxBody}>
                                        <div style={{ color: '#FFF', marginBottom: '1vh' }}>每日可提现{this.state.cashWithdrawalInfo !== null ? this.state.cashWithdrawalInfo.all_time : 0}次，今日还可提现{this.state.cashWithdrawalInfo !== null ? this.state.cashWithdrawalInfo.can_time : 0}次</div>
                                        <div style={{ color: '#FFF', marginBottom: '1vh' }}>当前余额：{this.state.cashWithdrawalInfo !== null ? this.state.cashWithdrawalInfo.total : 0}元</div>
                                        <div style={{ color: '#FFF', marginBottom: '1vh' }}>已打印码量：{this.state.cashWithdrawalInfo !== null ? this.state.cashWithdrawalInfo.valid_bet : 0}</div>
                                        <Form.Item className={styles.loginBodyBoxBodyItem} extra={"注：必须是能使用的卡提现"}>
                                            {getFieldDecorator('bank_title', {
                                                rules: [{ required: true, message: '请选择收款银行卡' }],
                                                initialValue: this.state.cashWithdrawalInfo !== null ? (this.state.cashWithdrawalInfo.username === undefined || this.state.cashWithdrawalInfo.username === undefined ? "请绑定银行卡" : this.state.cashWithdrawalInfo.username + '一' + this.state.cashWithdrawalInfo.account) : null
                                            })(
                                                <Input type="text" disabled={true} placeholder="请选择收款银行卡" />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}  extra={"注：最小100.00元，最大49,999.00元。（如需提现超过5万金币，请分多笔提现）"}>
                                            {getFieldDecorator('money', {
                                                rules: [
                                                    { required: true, message: '请输入提现金额' },
                                                    { validator: this.validMoney }
                                                ],
                                            })(
                                                <Input className={styles.loginBodyBoxBodyItemInput} autoComplete="off" placeholder="请输入提现金额" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem} >
                                            {getFieldDecorator('draw_pwd', {
                                                rules: [
                                                    { required: true, message: '请输入资金密码' },
                                                    { pattern: /^[0-9]{6}$/, message: '请输入6位数字资金密码' }
                                                ],
                                            })(
                                                <Input.Password className={styles.loginBodyBoxBodyItemInput} onBlur={this.handleConfirmBlur} placeholder="请输入资金密码" autoComplete="new-password" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className={styles.loginBodyBoxButton}>
                                        <span onClick={this.handleSubmit} className={styles.loginButton}>发起提现</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

const CashWithdrawalView = Form.create({ name: 'CashWithdrawalForm' })(CashWithdrawalForm);

function mapStateToProps(state) {
    return {
        cashWithdrawalBox: state.withdrawals.cashWithdrawalBox,
        loading: state.loading.effects['withdrawals/getCashWithdrawalInfo'] || false,
    }
}

export default connect(mapStateToProps)(CashWithdrawalView);