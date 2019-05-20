
import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Input, Form, Icon, Checkbox, Button, Select, Row, Col } from 'antd';
import api from '../config/definde';
import styles from '../style/loginView.css';
import storage from 'utils/localStorage';
const Option = Select.Option;
class RegisterView extends React.Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
            verfyUrl: null,
            questionList: [],
            agentId:null
        }
    }


    componentDidMount() {
        let reg = new RegExp('(^|&)' + 'agent_id' + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            this.setState({ agentId: unescape(r[2]) })
        }
       if(this.state.agentId !==null){
          console.log(unescape(r[2]));
       }
        
        let verfyUrl = api.apiUrl + '/Index/entrycode';
        this.setState({
            verfyUrl: verfyUrl
        }, () => {
            this.onGetQuestionList();
        });
    }

    onGetQuestionList() {
        this.props.dispatch({   //银行
            type: 'common/getQuestionList',
            payload: null,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        questionList: res
                    });
                }
            }
        });
    }

    hideLoginView() {
        this.props.dispatch({
            type: 'login/changeRegisterBox',
            payload: false
        });
    }

    showRegisterRuleView() {
        this.props.dispatch({
            type: 'login/changeRegisterBox',
            payload: false
        });
        this.props.dispatch({
            type: 'login/changeRegisterRuleBox',
            payload: true
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirmPassword'], { force: true });
        }
        callback();
    }

    handleDrawConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstDrawPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('draw_pwd')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextDrawPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm_draw_pwd'], { force: true });
        }
        callback();
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!values.argee) {
                    this.props.form.setFields({
                        argee: {
                            value: values.argee,
                            errors: [new Error('请确认已知晓开户协议')],
                        },
                    });
                } else {
                    this.props.dispatch({
                        type: 'login/register',
                        payload: values,
                        callback: (res) => {
                            if (res.errorCode && res.errorCode !== 1) {
                                this.getVerfyUrl();
                                this.props.form.setFields({
                                    submit: {
                                        value: values.submit,
                                        errors: [new Error(res.errorMsg || '未知错误')],
                                    },
                                });
                            } else {
                                let loginParam = {};
                                loginParam.account = values.account;
                                loginParam.password = values.password;
                                this.props.dispatch({
                                    type: 'login/login',
                                    payload: loginParam,
                                    callback: (res) => {
                                        if (res.errorCode && res.errorCode !== 1) {
                                            this.props.form.setFields({
                                                submit: {
                                                    value: values.submit,
                                                    errors: [new Error(res.errorMsg || '未知错误')],
                                                },
                                            });
                                        } else {
                                            storage.add('user', res);
                                            storage.add('loginStatus', true);
                                            this.props.dispatch({
                                                type: 'login/changeRegisterBox',
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
                        }
                    });
                }
            }
        });

    }
    goToLogin = () => {
        this.props.dispatch({
            type: 'login/changeRegisterBox',
            payload: false
        });
        this.props.dispatch({
            type: 'login/changeLoginBox',
            payload: true
        });
    }

    getVerfyUrl() {
        let verfyUrl = api.apiUrl + '/Index/entrycode';
        this.setState({
            verfyUrl: verfyUrl + '?' + Date.parse(new Date())
        });
    }
    renderQuestionList() {
        if (this.state.questionList.length > 0) {
            let views = [];
            let questionList = this.state.questionList;
            for (let i = 0; i < questionList.length; i++) {
                const item = questionList[i];
                views.push(<Option key={i} value={item.id}>{item.question}</Option>);
            }
            return views;
        } else {
            return null;
        }
    }

    render() {
        const { registerBox, form, loading } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'40vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={registerBox}
                onOk={() => this.sureLoginView()}
                onCancel={() => this.hideLoginView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={styles.loginBox}>
                            <div className={styles.loginBody}>
                                <div className={styles.loginBodyBox}>
                                    <div className={styles.loginBodyBoxTitle}>用户注册</div>
                                    <div className={styles.loginBodyBoxBody}>
                                        <Row type="flex" justify="space-between" style={{ flexDirection: 'row', width: '100%' }}>
                                            <Col span={11}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem} extra={"注：tz开头+数字与字母组合(7-10位)"}>
                                                    {getFieldDecorator('account', {
                                                        rules: [
                                                            { required: true, message: '请输入您的帐号' },
                                                            { pattern: /^[t][z](?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{7,10}$/, message: 'tz开头+数字与字母组合(7-10位)' }
                                                        ],
                                                    })(
                                                        <Input prefix={<Icon type="user" style={{ color: '#FFF' }} />} placeholder="请输入您的帐号" autoComplete="off" onPressEnter={this.sureRegister} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('truename', {
                                                        rules: [{ required: true, message: '请输入您的真实名称' }],
                                                    })(
                                                        <Input prefix={<Icon type="user" style={{ color: '#FFF' }} />} type="text" placeholder="请输入您的真实名称" autoComplete="off" onPressEnter={this.sureRegister} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row type="flex" justify="space-between" style={{ flexDirection: 'row', width: '100%' }}>
                                            <Col span={11}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('password', {
                                                        rules: [
                                                            { required: true, message: '请输入您的密码' },
                                                            { pattern: /^[0-9a-zA-Z]{6,12}$/, message: '请输入6-12位数字或字母组合' },
                                                            { validator: this.validateToNextPassword }
                                                        ],
                                                    })(
                                                        <Input.Password prefix={<Icon type="lock" style={{ color: '#FFF' }} />} maxLength={12} placeholder="请输入您的密码" autoComplete="new-password" onPressEnter={this.sureRegister} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('confirmPassword', {
                                                        rules: [
                                                            { required: true, message: '请输入确认密码', },
                                                            { pattern: /^[0-9a-zA-Z]{6,12}$/, message: '请输入6-12位数字或字母组合' },
                                                            { validator: this.compareToFirstPassword }
                                                        ],
                                                    })(
                                                        <Input.Password prefix={<Icon type="lock" style={{ color: '#FFF' }} />} maxLength={12} onBlur={this.handleConfirmBlur} autoComplete="new-password" placeholder="请输入确认密码" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row type="flex" justify="space-between" style={{ flexDirection: 'row', width: '100%' }}>
                                            <Col span={11}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('draw_pwd', {
                                                        rules: [
                                                            { required: true, message: '请输入交易密码' },
                                                            { pattern: /^[0-9]{6}$/, message: '请输入6位数字交易密码' },
                                                            { validator: this.validateToNextDrawPassword }
                                                        ],
                                                    })(
                                                        <Input.Password prefix={<Icon type="poweroff" style={{ color: '#FFF' }} />} maxLength={6} placeholder="请输入交易密码" autoComplete="new-password" onPressEnter={this.sureRegister} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('confirm_draw_pwd', {
                                                        rules: [
                                                            { required: true, message: '请输入确认交易密码', },
                                                            { validator: this.compareToFirstDrawPassword }
                                                        ]
                                                    })(
                                                        <Input.Password prefix={<Icon type="poweroff" style={{ color: '#FFF' }} />} maxLength={6} onBlur={this.handleDrawConfirmBlur} autoComplete="new-password" placeholder="请输入确认交易密码" onPressEnter={this.sureRegister} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row type="flex" justify="space-between" style={{ flexDirection: 'row', width: '100%' }}>
                                            <Col span={11}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('question_id', {
                                                        rules: [{ required: true, message: '请选择密保问题' }]
                                                    })(
                                                        <Select className="selectItem" placeholder="请选择密保问题">
                                                            {this.renderQuestionList()}
                                                        </Select>)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('answer', {
                                                        rules: [{ required: true, message: '请输入问题答案' }],
                                                    })(
                                                        <Input placeholder="请输入问题答案" autoComplete="off" onPressEnter={this.sureRegister} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row type="flex" justify="space-between" style={{ flexDirection: 'row', width: '100%' }}>
                                            <Col span={11}>
                                                <Form.Item className={styles.loginBodyBoxBodyItem}>
                                                    {getFieldDecorator('agent_id', {
                                                        // rules: [{ required: true, message: '请选择收款银行卡' }],
                                                        initialValue: this.state.agentId === null ? null : this.state.agentId 
                                            })(
                                                            <Input prefix={<Icon type="user" style={{ color: '#FFF' }} />} placeholder="推荐码" autoComplete="off" onPressEnter={this.sureRegister} />
                                                        )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                                                    <Col span={18}>
                                                        <Form.Item >{getFieldDecorator('code', {
                                                            rules: [{ required: true, message: '请输入验证码' }],
                                                        })(
                                                            <Input prefix={<Icon type="insurance" style={{ color: '#FFF' }} />} autoComplete="off" placeholder="请输入验证码" onPressEnter={this.sureRegister} />
                                                        )}</Form.Item>
                                                    </Col>
                                                    <Col span={5}>
                                                        <img src={this.state.verfyUrl} onClick={() => this.getVerfyUrl()} style={{ width: '100%', height: 32, marginTop: 3, cursor: 'pointer' }} />
                                                    </Col>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('submit')(
                                                <Button style={{ height: 45, background: '#9e150e', border: 0, color: '#fff', fontSize: 18 }} block={true} disabled={this.state.registerButton} htmlType="submit">立即开户</Button>
                                            )}
                                        </Form.Item>
                                        <Row type="flex" justify="space-between" style={{ flexDirection: 'row', width: '100%' }}>
                                            <Col span={11}>
                                                <Form.Item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', }}>
                                                    {getFieldDecorator('argee', {
                                                        rules: [{ required: true, message: '请确认已知晓开户协议' }]
                                                    })(
                                                        <Checkbox>我已届满合法博彩年龄，且同意各项开户条约 </Checkbox>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <div onClick={() => this.showRegisterRuleView()} style={{ color: 'cornflowerblue', paddingTop: '1vh', cursor: 'pointer' }}>开户协议</div>
                                            </Col>
                                        </Row>
                                        <div onClick={this.goToLogin} style={{ color: '#fff', fontSize: 18, cursor: 'pointer' }}>
                                            已有账号？<span>立即登录</span>
                                        </div>
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

const RegisterForm = Form.create({ name: 'RegisterForm' })(RegisterView);

function mapStateToProps(state) {
    return {
        registerBox: state.login.registerBox,
        loading: state.loading.effects['bankCard/addBankCard'] || false
    }
}

export default connect(mapStateToProps)(RegisterForm);