import { connect } from 'dva';
import { Modal, Spin, Input, Form, Checkbox } from 'antd';
import storage from 'utils/localStorage';
import styles from '../style/loginView.css';
class FundPasswordForm extends React.Component {
    constructor() {
        super();
        this.state = {
            nickname: null,
            showConfimPassStatus: true,
            defaultCheckBoxValue: 'checked',
            defaultCheckBoxStatus: true
        }
    }

    componentDidMount() {
        let userInfoString = storage.get('user');
        let userInfoObject = JSON.parse(userInfoString);
        if (userInfoObject.is_draw_pwd === 1 && userInfoObject.is_automatic === 1) {
            this.setState({
                nickname: userInfoObject.nickname,
                showConfimPassStatus: false,
                defaultCheckBoxStatus: true,
                defaultCheckBoxValue: 'checked'
            })
        } else if (userInfoObject.is_draw_pwd === 1 && userInfoObject.is_automatic === 0) {
            this.setState({
                nickname: userInfoObject.nickname,
                showConfimPassStatus: false,
                defaultCheckBoxStatus: false,
                defaultCheckBoxValue: 'check'
            })
        } else if (userInfoObject.is_draw_pwd === 0 && userInfoObject.is_automatic === 0) {
            this.setState({
                nickname: userInfoObject.nickname,
                showConfimPassStatus: true,
                defaultCheckBoxStatus: false,
                defaultCheckBoxValue: 'check'
            })
        } else {
            this.setState({
                nickname: userInfoObject.nickname,
                showConfimPassStatus: true,
                defaultCheckBoxStatus: true,
                defaultCheckBoxValue: 'checked'
            })
        }
    }

    hideFundPassView() {
        this.props.dispatch({
            type: 'user/changeFundPassBox',
            payload: false
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.checked) {
                    values.is_automatic = 1;
                } else {
                    values.is_automatic = 0;
                }
                if (!this.state.showConfimPassStatus) {
                    for (var key in values) {
                        if (key === 'drawPwd') {
                            delete values[key];
                        }
                        if (key === 'checked') {
                            delete values[key];
                        }
                    }
                }
                this.props.dispatch({
                    type: 'user/updateFundPass',
                    payload: values,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                checked: {
                                    value: values.checked,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                        } else {
                            let userInfoString = storage.get('user');
                            let userInfoObject = JSON.parse(userInfoString);
                            userInfoObject.is_automatic = values.is_automatic;
                            userInfoObject.nickname = values.nickname;
                            if (!this.state.showConfimPassStatus) {
                                userInfoObject.is_draw_pwd = 1;
                            }
                            storage.add('user', userInfoObject);
                            this.props.dispatch({
                                type: 'user/changeFundPassBox',
                                payload: false
                            });
                        }
                    }
                });
            }
        });
    }

    render() {
        const { fundPassBox, form, loading } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={fundPassBox}
                onCancel={() => this.hideFundPassView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <Form>
                        <div className={styles.loginBox}>
                            <div className={styles.loginBody}>
                                <div className={styles.loginBodyBox}>
                                    <div className={styles.loginBodyBoxTitle}>资金密码</div>
                                    <div className={styles.loginBodyBoxBody}>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('nickname', {
                                                rules: [
                                                    { required: true, message: '请输入用户昵称!' }
                                                ],
                                                initialValue: this.state.nickname
                                            })(
                                                <Input className={styles.loginBodyBoxBodyItemInput} autoComplete="off" placeholder="请输入用户昵称" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                            <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                {getFieldDecorator('drawPwd', {
                                                    initialValue: !this.state.showConfimPassStatus ? 'showConfimPassStatus' : null
                                                })(
                                                    <Input type="password" disabled={!this.state.showConfimPassStatus} className={styles.loginBodyBoxBodyItemInput} placeholder="请输入新密码" autoComplete="new-password" onPressEnter={this.handleSubmit} />
                                                )}
                                            </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('checked', {
                                                valuePropName: this.state.defaultCheckBoxValue,
                                                initialValue: this.state.defaultCheckBoxStatus
                                            })(
                                                <Checkbox className={styles.checboxStyle}>勾选此选项后，系统将自动将您的余额带入当前游戏大厅</Checkbox>
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className={styles.loginBodyBoxButton}>
                                        <span onClick={this.handleSubmit} className={styles.loginButton}>确认提交</span>
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
const FundPasswordView = Form.create({ name: 'FundPasswordView' })(FundPasswordForm);

function mapStateToProps(state) {
    return {
        fundPassBox: state.user.fundPassBox,
        loading: state.loading.effects['user/updateLoginPwd'] || false
    }
}

export default connect(mapStateToProps)(FundPasswordView);