import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Form, Select, Input } from 'antd';
import _ from "lodash";
import storage from '../utils/localStorage';
import styles from 'style/agencyTransfer.css';
const Option = Select.Option;
class AgencyTransferView extends Component {
    constructor() {
        super();
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
    }


    hideAgencyTransferBoxView() {
        this.props.dispatch({
            type: 'agency/changeAgencyTransferBox',
            payload: false
        });
        this.props.dispatch({
            type: 'agency/changeAgencyTransferInfo',
            payload: null
        });
    }


    validMoney = (rule, value, callback) => {
        if (value > JSON.parse(storage.get('user')).total) {
            callback('可用余额不足。');
        } else if(_.toNumber(value) === 0) {
            callback('请输入转账金额！');
        } else {
            callback();
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'agency/toDownAgencyTransfer',
                    payload: values,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                type: {
                                    value: values.type,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                        } else {
                            let userInfoString = storage.get('user');
                            let userInfoObject = JSON.parse(userInfoString);
                            let goldTotal = _.round(_.subtract(userInfoObject.total, values.total), 2);

                            userInfoObject.total = goldTotal;
                            storage.add('user', userInfoObject);
                            this.props.dispatch({
                                type: 'agency/changeAgencyTransferInfo',
                                payload: null
                            });
                            this.props.dispatch({
                                type: 'agency/changeAgencyTransferBox',
                                payload: false
                            });
                            this.props.dispatch({
                                type: 'agency/changeAgencyTransferRecordBox',
                                payload: true
                            });
                        }
                    }
                });
            }
        });
    }

    render() {
        const { agencyTransferBox, form, loading, agencyTransferInfo } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={agencyTransferBox}
                onCancel={() => this.hideAgencyTransferBoxView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.agencyTransferBox}>
                        <div className={styles.agencyTransferBody}>
                            <div className={styles.agencyTransferBodyBox}>
                                <div className={styles.agencyTransferBodyBoxTitle}>代理转账</div>
                                <div className={styles.agencyTransferBodyBoxBody}>
                                    <Form.Item className={styles.agencyTransferBodyBoxBodyItem}>
                                        {getFieldDecorator('account', {
                                            initialValue: agencyTransferInfo,
                                            rules: [{ required: true, message: '请输入下级用户名!' }],
                                        })(
                                            <Input disabled={agencyTransferInfo !== null ? true : false} className={styles.agencyTransferBodyBoxBodyItemInput} autoComplete="off" placeholder="请输入下级用户名" onPressEnter={this.handleSubmit} />
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.agencyTransferBodyBoxBodyItem}>
                                        {getFieldDecorator('total', {
                                            rules: [
                                                { required: true, message: '请输入转账金额!' },
                                                { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '转账金额格式不正确' },
                                                { validator: this.validMoney }
                                            ],
                                        })(
                                            <Input className={styles.agencyTransferBodyBoxBodyItemInput} autoComplete="off" placeholder="请输入转账金额" onPressEnter={this.handleSubmit} />
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.agencyTransferBodyBoxBodyItem}>
                                        {getFieldDecorator('pay_pwd', {
                                            rules: [{ required: true, message: '请输入资金密码!' }],
                                        })(
                                            <Input.Password className={styles.agencyTransferBodyBoxBodyItemInput} placeholder="请输入资金密码" autoComplete="new-password" onPressEnter={this.handleSubmit} />
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.agencyTransferBodyBoxBodyItem}>
                                        {getFieldDecorator('type', {
                                            rules: [{ required: true, message: '请选择你的交易类型!' }],
                                        })(
                                            <Select placeholder="请选择你的交易类型" style={{ width: "100%" }}>
                                                <Option value="1">下级分红</Option>
                                                <Option value="2">下级转账</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className={styles.agencyTransferBodyBoxButton}>
                                    <span onClick={this.handleSubmit} className={styles.loginButton}>确认转账</span>
                                    <span onClick={() => this.hideAgencyTransferBoxView()} className={styles.registerButton}>取消</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}

const AgencyTransferForm = Form.create({ name: 'agencyTransferForm' })(AgencyTransferView);

function mapStateToProps(state) {
    return {
        agencyTransferBox: state.agency.agencyTransferBox,
        agencyTransferInfo: state.agency.agencyTransferInfo,
        loading: state.loading.effects['login/login'] || false,
    }
}

export default connect(mapStateToProps)(AgencyTransferForm);