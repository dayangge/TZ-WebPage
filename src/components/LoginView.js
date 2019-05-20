import { connect } from 'dva';
import { Modal, Spin, Input, Form, Icon, Checkbox } from 'antd';
import styles from '../style/loginView.css';
import storage from 'utils/localStorage';

class LoginView extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
    }

    hideLoginView() {
        this.props.dispatch({
            type: 'login/changeLoginBox',
            payload: false
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'login/login',
                    payload: values,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                remember: {
                                    value: values.remember,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                        } else {
                            if (values.remember) {
                                storage.add('account', values.account);
                                storage.add('password', values.password);
                            }
                            storage.add('user', res);
                            storage.add('loginStatus', true);
                            this.props.dispatch({
                                type: 'login/changeLoginBox',
                                payload: false
                            });
                            this.props.dispatch({
                                type: 'login/changeLoginStatus',
                                payload: true
                            });
                        }
                    }
                });
            }
        });
    }

    goToRegister = () => {
        this.props.dispatch({
            type: 'login/changeLoginBox',
            payload: false
        });
        this.props.dispatch({
            type: 'login/changeRegisterBox',
            payload: true
        });
    }

    render() {
        const { loginBox, form, loading } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'20vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={loginBox}
                onCancel={() => this.hideLoginView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <Form>
                        <div className={styles.loginBox}>
                            <div className={styles.loginBody}>
                                <div className={styles.loginBodyBox}>
                                    <div className={styles.loginBodyBoxTitle}>用户登录</div>
                                    <div className={styles.loginBodyBoxBody}>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('account', {
                                                initialValue: storage.get('account'),
                                                rules: [{ required: true, message: '请输入您的帐号!' }],
                                            })(
                                                <Input className={styles.loginBodyBoxBodyItemInput} prefix={<Icon type="user" style={{ color: 'rgba(255,255,255,.8)' }} />} placeholder="请输入您的帐号" autoComplete="off" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('password', {
                                                initialValue: storage.get('password'),
                                                rules: [{ required: true, message: '请输入您的密码!' }],
                                            })(
                                                <Input.Password className={styles.loginBodyBoxBodyItemInput} prefix={<Icon type="lock" style={{ color: 'rgba(255,255,255,.8)' }} />} autoComplete="new-password" placeholder="请输入您的密码" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('remember', {
                                                valuePropName: 'checked',
                                                initialValue: true,
                                            })(
                                                <Checkbox className={styles.checboxStyle}>记住帐号</Checkbox>
                                            )}
                                            {/* <span className={styles.forgetPass} >忘记密码</span> */}
                                        </Form.Item>
                                    </div>
                                    <div className={styles.loginBodyBoxButton}>
                                        <span onClick={this.handleSubmit} className={styles.loginButton}>立即登录</span>
                                        <span className={styles.registerButton} onClick={this.goToRegister}>马上注册</span>
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

const LoginForm = Form.create({ name: 'loginForm' })(LoginView);

function mapStateToProps(state) {
    return {
        loginBox: state.login.loginBox,
        loading: state.loading.effects['login/login'] || false,
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(LoginForm);