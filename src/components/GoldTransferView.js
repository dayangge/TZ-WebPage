import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Select, Input, Form } from 'antd';
import storage from '../utils/localStorage';
import _ from "lodash";
import styles from '../style/loginView.css';
const Option = Select.Option;
class GoldTransferForm extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            platGold: null,
            platName: null,
            platList: []
        }
    }

    componentDidMount() {
        this.getPlatList();
    }

    getPlatList() {
        this.props.dispatch({   //银行
            type: 'common/getPlatList',
            payload: null,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        platList: res
                    });
                }
            }
        });
    }

    hideGoldTransferView() {
        this.props.dispatch({
            type: 'gold/changeGoldTransferBox',
            payload: false
        });
    }


    onChangeType = (value) => {    //游戏平台
        //检查某个list里面有没有某个元素，如果没有则添加进去 则用到_.findIndex。
        let platKey = _.findIndex(this.state.platList, function (o) { return _.toInteger(o.id) === _.toInteger(value); });
        let platInfo = this.state.platList[platKey];
        this.setState({
            platGold: platInfo.money,
            platName: platInfo.channel_name
        })
    }

    renderPlatList() {   //游戏平台
        if (this.state.platList.length === 0) {
            return null;
        } else {
            let views = [];
            let platList = this.state.platList;
            for (let i = 0; i < platList.length; i++) {
                let item = platList[i];
                views.push(<Option key={i} value={item.id}>{item.channel_name}</Option>);
            }
            return views;
        }
    }

    renderPlatInfo() {   //
        if (this.state.platGold === null && this.state.platName === null) {
            return null;
        } else {
            return this.state.platName + "现有：" + this.state.platGold + "元";
        }
    }


    validMoney = (rule, value, callback) => {
        if (value <= 0) {
            callback('转账金额不不能小于等于0。');
        } else {
            callback();
        }
    }

    handleSubmit(e, type) {
        let userInfoString = storage.get('user');
        let userInfoObject = JSON.parse(userInfoString);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (type === 1 && _.toNumber(userInfoObject.total) < _.toNumber(values.money)) {
                    this.props.form.setFields({
                        money: {
                            value: values.money,
                            errors: [new Error('当前金币不足，不够转入')],
                        },
                    });
                    return false;
                }
                if (type === 2 && _.toNumber(values.money) > _.toNumber(this.state.platGold)) {
                    this.props.form.setFields({  //setField更新个别字段的值。
                        money: {
                            value: values.money,
                            errors: [new Error('平台金币不足，不够转出')],
                        },
                    });
                    return false;
                }
                values.paytype = type;
                this.props.dispatch({
                    type: 'gold/addGoldTransferOrWithdrawal',
                    payload: values,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                pay_pwd: {
                                    value: values.pay_pwd,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                        } else {
                            userInfoObject.total = res;
                            storage.add('user', userInfoObject);
                            this.props.dispatch({
                                type: 'gold/changeGoldTransferBox',
                                payload: false
                            });
                            this.props.dispatch({
                                type: 'gold/changeTransferRecordBox',
                                payload: true
                            });
                        }
                    }
                });
            }
        });
    }

    render() {
        const { goldTransferBox, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={goldTransferBox}
                onCancel={() => this.hideGoldTransferView()}
            >
                <Spin spinning={this.state.loading} size="large" tip="正在处理中" delay={500} >
                    <Form>
                        <div className={styles.loginBox}>
                            <div className={styles.loginBody}>
                                <div className={styles.loginBodyBox}>
                                    <div className={styles.loginBodyBoxTitle}>金币转账</div>
                                    <div className={styles.loginBodyBoxBody}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', color: '#fff', flexDirection: 'row', width: '100%', marginBottom: '0.5vw' }}>
                                            <span>当前账户余额：</span>
                                            <span>{JSON.parse(storage.get('user')).total}元</span>
                                        </div>
                                        <Form.Item className={styles.loginBodyBoxBodyItem} extra={this.renderPlatInfo()}>
                                            {getFieldDecorator('channelId', {
                                                rules: [{ required: true, message: '请选择平台' }],
                                            })(
                                                <Select style={{ width: '100%' }} onChange={this.onChangeType} placeholder="请选择游戏平台">
                                                    {this.renderPlatList()}
                                                </Select>
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('money', {
                                                rules: [
                                                    { required: true, message: '请输入金额' },
                                                    { validator: this.validMoney }
                                                ],
                                            })(
                                                <Input placeholder="请输入金额" type="text" autoComplete="off" />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('pay_pwd', {
                                                rules: [{ required: true, message: '请输入交易密码' }],
                                            })(
                                                <Input.Password placeholder="请输入交易密码" autoComplete="new-password" />
                                            )}
                                        </Form.Item>
                                        <div className={styles.loginBodyBoxButton}>
                                            <span onClick={(e) => this.handleSubmit(e, 1)} className={styles.loginButton}>转入</span>
                                            <span onClick={(e) => this.handleSubmit(e, 2)} className={styles.registerButton}>转出</span>
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
const GoldTransferView = Form.create({ name: 'GoldTransferView' })(GoldTransferForm);
function mapStateToProps(state) {
    return {
        goldTransferBox: state.gold.goldTransferBox,
        loading: state.loading.effects['common/getPlatList', 'gold/changeGoldTransferBox', 'gold/changeTransferRecordBox', 'gold/addGoldTransferOrWithdrawal'] || false
    }
}

export default connect(mapStateToProps)(GoldTransferView);