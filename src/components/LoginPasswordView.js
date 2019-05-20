import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Input, Form } from 'antd';
import styles from 'style/loginView.css';
class LoginPasswordForm extends Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false
        }
    }

    componentDidMount() {
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => { 
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPwd')) {  //获取控件的值
            callback('两次密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirmNewPwd'], { force: true });   //表单验证
        }
        callback();
    }

    hideLoginPassView() {
        this.props.dispatch({
            type: 'user/changeLoginPassBox',
            payload: false
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'user/updateLoginPwd',
                    payload: values,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                confirmNewPwd: {
                                    value: values.confirmNewPwd,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                        } else {
                            var thiz = this;
                            Modal.success({
                                title: '消息提示',
                                content: '密码修改成功',
                                centered: true,
                                okText: '确定',
                                onOk() {
                                    thiz.props.dispatch({
                                        type: 'user/changeLoginPassBox',
                                        payload: false
                                    });
                                    thiz.props.dispatch({
                                        type: 'common/changeMenuStatus',
                                        payload: false
                                    });
                                    thiz.props.dispatch({
                                        type: 'login/logout'
                                    });
                                },
                            });
                        }
                    }
                });
            }
        });
    }

    render() {
        const { loginPassBox, form, loading } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={loginPassBox}
                onCancel={() => this.hideLoginPassView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <Form>
                        <div className={styles.loginBox}>
                            <div className={styles.loginBody}>
                                <div className={styles.loginBodyBox}>
                                    <div className={styles.loginBodyBoxTitle}>修改登录密码</div>
                                    <div className={styles.loginBodyBoxBody}>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('pwd', {
                                                rules: [{ required: true, message: '请输入当前登录密码!' }],
                                            })(
                                                <Input.Password className={styles.loginBodyBoxBodyItemInput} placeholder="请输入当前登录密码" autoComplete="new-password" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('newPwd', {
                                                rules: [
                                                    { required: true, message: '请输入新密码!' },
                                                    { pattern: /^[0-9a-zA-Z]{6,12}$/, message: '请输入6-12位数字或字母组合' },
                                                    { validator: this.validateToNextPassword }
                                                ],
                                            })(
                                                <Input.Password className={styles.loginBodyBoxBodyItemInput} placeholder="请输入新密码" autoComplete="new-password" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('confirmNewPwd', {
                                                rules: [
                                                    { required: true, message: '请确认新密码!' },
                                                    { pattern: /^[0-9a-zA-Z]{6,12}$/, message: '请输入6-12位数字或字母组合' },
                                                    { validator: this.compareToFirstPassword }
                                                ],
                                            })(
                                                <Input.Password className={styles.loginBodyBoxBodyItemInput} onBlur={this.handleConfirmBlur} autoComplete="new-password" placeholder="请确认新密码" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className={styles.loginBodyBoxButton}>
                                        <span onClick={this.handleSubmit} className={styles.loginButton}>确认修改</span>
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

const LoginPasswordView = Form.create({ name: 'LoginPasswordView' })(LoginPasswordForm);
function mapStateToProps(state) {
    return {
        loginPassBox: state.user.loginPassBox,
        loading: state.loading.effects['user/updateLoginPwd'] || false,
    }
}

export default connect(mapStateToProps)(LoginPasswordView);