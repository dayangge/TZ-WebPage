import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Select, Input, Form, notification } from 'antd';
import styles from '../style/recharge.css';
import _ from "lodash";
import copy from 'copy-to-clipboard';
const Option = Select.Option;

class RechargeForm extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            rechargeType: 1,
            bankList: [],
            rechargeResultInfoBox: false,

            rechargeWechatInfo: null,
            weChatAmount: null,
            rechargeAlipayInfoBox: false,
            rechargeAlipayInfo: null,
            alipayAmount: null,

            rechargeAlipayTransferBox: false,
            paymentAmount: null,
            paymentAmountInfo: null,
            paymentName: null,
            paymentAccount: null,
            paymentFuyan: null,
            cashBankInfo: null,
            cashBankNameInfo: null,
            paymentBank: null,
            paymentBankId: null,
            paymentBankNum: null,
            paymentCardName: null,
            rechargeBanktInfoBox: false
        }
    }

    componentDidMount() {
    }

    //获取所有银行列表
    onGetBankList(type) {
        this.props.dispatch({   //银行
            type: 'common/getBankList',
            payload: null,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.onGetCashBankInfo(type, res);
                }
            }
        });
    }

    //获取系统银行卡信息
    onGetCashBankInfo(type, bankList = []) {
        this.props.dispatch({
            type: 'recharge/getRechargeBankCard',
            payload: null,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                    return false;
                } else {
                    this.setState({
                        cashBankInfo: res,
                        cashBankNameInfo: res.bank_name,
                        rechargeType: type,
                        bankList: bankList
                    });
                }
            }
        });
    }

    //隐藏充值框
    hideFastRechargeView() {
        this.props.dispatch({
            type: 'recharge/changeFastRechargeBox',
            payload: false
        });
    }


    //选择充值方式
    onChangeRechargeType(type) {
        switch (type) {
            case 1: //微信扫码充值
                this.setState({
                    alipayBankAccount:null,
                    alipayBankName:null,
                    alipayBankAmount:null,
                    alipayAmount:null,
                    bankTransferAmount:null,
                    bankUserName:null,
                    rechargeType: type
                });
                break;
            case 2: //支付宝扫码充值
                this.setState({
                    alipayBankAccount:null,
                    alipayBankName:null,
                    alipayBankAmount:null,
                    weChatAmount:null,
                    bankTransferAmount:null,
                    bankUserName:null,
                    rechargeType: type
                });
                break;
            case 3: //支付转账充值
                this.onGetCashBankInfo(type);
                this.setState({
                    weChatAmount:null,
                    alipayAmount:null,
                    bankTransferAmount:null,
                    bankUserName:null,
                })
                break;
            case 4: //银行转账充值
                this.onGetBankList(type);
                this.setState({
                    weChatAmount:null,
                    alipayAmount:null,
                    alipayBankAccount:null,
                    alipayBankName:null,
                    alipayBankAmount:null,
                    bankTransferAmount:null,
                    bankUserName:null,
                })
                break;
            default:
                notification.error({
                    message: `请求错误 `,
                    description: '充值方式有误',
                });
                break;
        }
    }

    //复制内容
    copyClick = (content) => {
        document.execCommand("copy");
        if (copy(content)) {
            notification.success({
                message: `复制成功`,
            })
        } else {
            notification.error({
                message: `复制失败`,
            });
        }
    }

    renderBankList() {
        if (this.state.bankList.length > 0) {
            let views = [];
            let bankList = this.state.bankList;
            for (let i = 0; i < bankList.length; i++) {
                const item = bankList[i];
                views.push(<Option key={i + 1} value={item.bank_id}>{item.bank_name}</Option>);
            }
            return views;
        } else {
            return null;
        }
    }

    //验证金额不低于100
    validMoney = (rule, value, callback) => {
        if (_.toInteger(value) === 0) {
            callback();
        } else if (_.toInteger(value) < 100 || _.toInteger(value) > 49999) {
            callback('充值金额，最低为100,最高为49999');
        } else {
            callback();
        }
    }

    //更新微信扫码充值金额
    onChangeWechatAmount(number) {
        let thiz = this;
        if (_.toInteger(number) >= 100 && _.toInteger(number) <= 49999) {
            thiz.setState({
                weChatAmount: number
            }, () => {
                thiz.props.form.resetFields(['weChatAmount']);
            });
        } else {
            thiz.setState({
                weChatAmount: number
            }, () => {
                thiz.props.form.setFields({
                    weChatAmount: {
                        value: number,
                        errors: [new Error('充值金额，最低为100,最高为49999')],
                    },
                });
            })
        }
    }

    //预提交微信扫码充值
    onSubmitRechargeWechatTransfer = (e) => {     //提交
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'recharge/getWechatRechargeQrcode',
                    payload: false,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                weChatAmount: {
                                    value: null,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                            return false;
                        } else {
                            this.setState({
                                rechargeWechatInfo: res,
                                rechargeResultInfoBox: true    //二维码
                            })
                        }
                    }
                });
            }
        });
    }

    //返回微信扫码充值
    backSubmitWechartRecharge = () => {
        this.setState({
            rechargeWechatInfo: null,
            rechargeResultInfoBox: false    //二维码
        })
    }

    //确认微信扫码充值
    sureSubmitWechartRecharge = () => {   //二维码
        if (_.toInteger(this.state.weChatAmount) === 0) {
            this.props.form.setFields({
                wechatSubmitRecharge: {
                    value: null,
                    errors: [new Error('请填写充值金额')],
                },
            });
            return false;
        } else if (_.toInteger(this.state.weChatAmount) < 100) {
            this.props.form.setFields({
                wechatSubmitRecharge: {
                    value: null,
                    errors: [new Error('充值金额不得低100')],
                },
            });
            return false;
        } else if (this.state.rechargeWechatInfo === null || this.state.rechargeWechatInfo.fuyan === null || this.state.rechargeWechatInfo.fuyan === '') {
            this.props.form.setFields({
                alipaySubmitRecharge: {
                    value: null,
                    errors: [new Error('请填写充值金额')],
                },
            });
            return false;
        } else {
            let values = {};
            values.money = this.state.weChatAmount;
            values.fuyan = this.state.rechargeWechatInfo.fuyan;
            this.props.dispatch({
                type: 'recharge/sureWechatRecharge',
                payload: values,
                callback: (res) => {  //jsonStr
                    if (res.errorCode && res.errorCode !== 1) {
                        this.props.form.setFields({
                            wechatSubmitRecharge: {
                                value: null,
                                errors: [new Error(res.errorMsg || '未知错误')],
                            },
                        });
                        return false;
                    } else {
                        this.setState({
                            weChatAmount: null,
                            rechargeWechatInfoBox: false,
                            rechargeWechatInfo: null
                        }, () => {
                            this.props.dispatch({
                                type: 'recharge/changeFastRechargeBox',
                                payload: false
                            });
                            this.props.dispatch({
                                type: 'recharge/changeRechargeRecordBox',
                                payload: true
                            });
                        })

                    }
                }
            });
        }
    }

    //更新支付宝扫码充值金额
    onChangeAlipayAmount(number) {
        let thiz = this;
        if (_.toInteger(number) >= 100 && _.toInteger(number) <= 49999) {
            thiz.setState({
                alipayAmount: number
            }, () => {
                thiz.props.form.resetFields(['alipayAmount']);
            });
        } else {
            thiz.setState({
                alipayAmount: number
            }, () => {
                thiz.props.form.setFields({
                    alipayAmount: {
                        value: number,
                        errors: [new Error('充值金额，最低为100,最高为49999')],
                    },
                });
            })
        }
    }

    //预提交支付宝扫码充值
    onSubmitRechargeAlipayTranser = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'recharge/getAlipayRechargeQrcode',
                    payload: false,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                alipayAmount: {
                                    value: null,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                            return false;
                        } else {
                            this.setState({
                                rechargeAlipayInfo: res,
                                rechargeResultInfoBox: true
                            })
                        }
                    }
                });
            }
        });
    }

    //返回支付宝扫码充值
    backSubmitAlipayRecharge = () => {
        this.setState({
            rechargeAlipayInfo: null,
            rechargeResultInfoBox: false    //二维码
        })
    }

    //确认支付宝扫码充值
    sureSubmitAlipayRecharge = () => {
        if (_.toInteger(this.state.alipayAmount) === 0) {
            this.props.form.setFields({
                alipaySubmitRecharge: {
                    value: null,
                    errors: [new Error('请填写充值金额')],
                },
            });
            return false;
        } else if (_.toInteger(this.state.alipayAmount) < 100) {
            this.props.form.setFields({
                alipaySubmitRecharge: {
                    value: null,
                    errors: [new Error('充值金额不得低100')],
                },
            });
            return false;
        } else if (this.state.rechargeAlipayInfo === null || this.state.rechargeAlipayInfo.fuyan === null || this.state.rechargeAlipayInfo.fuyan === '') {
            this.props.form.setFields({
                alipaySubmitRecharge: {
                    value: null,
                    errors: [new Error('请填写充值金额')],
                },
            });
            return false;
        } else {
            let values = {};
            values.money = this.state.alipayAmount;
            values.fuyan = this.state.rechargeAlipayInfo.fuyan;
            this.props.dispatch({
                type: 'recharge/sureAlipayRecharge',
                payload: values,
                callback: (res) => {
                    if (res.errorCode && res.errorCode !== 1) {
                        this.props.form.setFields({
                            alipaySubmitRecharge: {
                                value: null,
                                errors: [new Error(res.errorMsg || '未知错误')],
                            },
                        });
                        return false;
                    } else {
                        this.setState({
                            alipayAmount: null,
                            rechargeAlipayInfoBox: false,
                            rechargeAlipayInfo: null
                        }, () => {
                            this.props.dispatch({
                                type: 'recharge/changeFastRechargeBox',
                                payload: false
                            });
                            this.props.dispatch({
                                type: 'recharge/changeRechargeRecordBox',
                                payload: true
                            });
                        })

                    }
                }
            });
        }
    }


    //支付宝转账充值
    onSubmitRechargeAlipayBankTransfer = (e) => {
        if (this.state.cashBankInfo === null || !this.state.cashBankInfo.fuyan) {
            this.props.form.setFields({
                alipayBankAmount: {
                    value: this.state.alipayAmount,
                    errors: [new Error('非法操作')],
                },
            });
            return false;
        }
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {};
                params.money = values.alipayBankAmount;
                params.alipay_name = values.alipayBankName;
                params.alipay_account = values.alipayBankAccount;
                params.fuyan = this.state.cashBankInfo.fuyan;
                this.props.dispatch({
                    type: 'recharge/getWechatRechargePayment',
                    payload: params,
                    callback: (res) => {  //jsonStr
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                alipayBankAmount: {
                                    value: this.state.alipayAmount,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                            return false;
                        } else {
                            this.setState({
                                rechargeResultInfoBox: true
                            });
                        }
                    }
                });
            }
        });
    }

    //确认支付宝转账充值
    sureSubmitTransferRecharge() {
        this.props.dispatch({
            type: 'recharge/changeFastRechargeBox',
            payload: false
        });
        this.props.dispatch({
            type: 'recharge/changeRechargeRecordBox',
            payload: true
        });
    }


    //更新银行卡转账充值金额
    onChangeBankTransferAmount(number) {
        if (_.toInteger(number) >= 100) {
            let thiz = this;
            thiz.setState({
                bankTransferAmount: number
            }, () => {
                thiz.props.form.resetFields(['bankTransferAmount']);
            });
        } else {
            this.setState({
                bankTransferAmount: number
            })
        }
    }

    //更新银行卡转账开户行
    chooseBank = (e) => {
        if (_.toInteger(e) !== 0 || _.toInteger(e) !== null) {
            let thiz = this;
            thiz.setState({
                bankId: _.toInteger(e)
            }, () => {
                thiz.props.form.resetFields(['bankId']);
            });
        } else {
            this.setState({
                bankId: _.toInteger(e)
            })
        }
    }

    //银行卡转账充值
    onSubmitRechargeBank = (e) => {
        if (this.state.cashBankInfo === null || !this.state.cashBankInfo.fuyan) {
            this.props.form.setFields({
                bankTransferAmount: {
                    value: this.state.alipayAmount,
                    errors: [new Error('非法操作')],
                },
            });
            return false;
        }
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {};
                params.money = values.bankTransferAmount;
                params.bank_id = values.bankId;
                params.bank_num = values.bankNumber;
                params.card_name = values.bankUserName;
                params.fuyan = this.state.cashBankInfo.fuyan;
                this.props.dispatch({
                    type: 'recharge/changeBankRechargeBox',
                    payload: params,
                    callback: (res) => {  //jsonStr
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                bankTransferAmount: {
                                    value: this.state.alipayAmount,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                            return false;
                        } else {
                            this.setState({
                                rechargeResultInfoBox: true
                            });
                        }
                    }
                });
            }
        });
    }

    //根据类型显示不同充值表单页面
    renderRechargeViewByType(getFieldDecorator, formItemLayout) {
        switch (this.state.rechargeType) {
            case 1:     //微信扫码
                return (
                    <div>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="充值方式" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <span onClick={() => this.onChangeRechargeType(1)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 1 && styles.amountHover].join(' ')}>微信扫码</span>
                                <span onClick={() => this.onChangeRechargeType(2)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 2 && styles.amountHover].join(' ')}>支付宝扫码</span>
                                <span onClick={() => this.onChangeRechargeType(3)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 3 && styles.amountHover].join(' ')}>支付宝转账</span>
                                <span onClick={() => this.onChangeRechargeType(4)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 4 && styles.amountHover].join(' ')}>银行卡转账</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="充值金额" {...formItemLayout}>
                            {getFieldDecorator('weChatAmount', {
                                initialValue: this.state.weChatAmount,
                                rules: [
                                    { required: true, message: '请输入充值金额，最低100' },
                                    { validator: this.validMoney }
                                ],
                            })(
                                <div>
                                    <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                        <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                            <Input type="text" value={this.state.weChatAmount} maxLength={5} autoComplete="off" onPressEnter={this.onSubmitRechargeWechatTransfer} onChange={(e) => this.onChangeWechatAmount(_.toInteger(e.target.value) === 0 ? null : _.toInteger(e.target.value))} placeholder="请输入充值金额，最低100" />
                                        </div>
                                        <span className={[styles.default, styles.rechargeBodyBoxBodyRechargeClear].join(' ')} onClick={() => this.onChangeWechatAmount(null)}>清除</span>
                                    </div>
                                    <div className={styles.rechargeBodyBoxBodyRechargeBody} >
                                        <span className={[styles.default, this.state.weChatAmount === 100 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(100)}>100元</span>
                                        <span className={[styles.default, this.state.weChatAmount === 200 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(200)}>200元</span>
                                        <span className={[styles.default, this.state.weChatAmount === 500 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(500)}>500元</span>
                                        <span className={[styles.default, this.state.weChatAmount === 1000 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(1000)}>1000元</span>
                                        <span className={[styles.default, this.state.weChatAmount === 2000 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(2000)}>2000元</span>
                                        <span className={[styles.default, this.state.weChatAmount === 3000 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(3000)}>3000元</span>
                                        <span className={[styles.default, this.state.weChatAmount === 5000 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(5000)}>5000元</span>
                                        <span className={[styles.default, this.state.weChatAmount === 10000 && styles.amountHover].join(' ')} onClick={() => this.onChangeWechatAmount(10000)}>10000元</span>
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <div className={styles.rechargeBodyBoxBodyRechargeBotton}>
                            <span onClick={this.onSubmitRechargeWechatTransfer}>确定</span>
                        </div>
                        <div className={styles.rechargeBodyBoxBodyRechargeText}>
                            <p>温馨提示：如有任何疑问，请联系在线客服获取帮助</p>
                        </div>
                    </div>
                );
                break;
            case 2:     //支付宝扫码
                return (
                    <div>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="充值方式" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <span onClick={() => this.onChangeRechargeType(1)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 1 && styles.amountHover].join(' ')}>微信扫码</span>
                                <span onClick={() => this.onChangeRechargeType(2)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 2 && styles.amountHover].join(' ')}>支付宝扫码</span>
                                <span onClick={() => this.onChangeRechargeType(3)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 3 && styles.amountHover].join(' ')}>支付宝转账</span>
                                <span onClick={() => this.onChangeRechargeType(4)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 4 && styles.amountHover].join(' ')}>银行卡转账</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="充值金额" {...formItemLayout}>
                            {getFieldDecorator('alipayAmount', {
                                initialValue: this.state.alipayAmount,
                                rules: [
                                    { required: true, message: '请输入充值金额，最低100' },
                                    { validator: this.validMoney }
                                ],
                            })(
                                <div>
                                    <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                        <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                            <Input type="text" value={this.state.alipayAmount} maxLength={5} autoComplete="off" onPressEnter={this.onSubmitRechargeAlipayTranser} onChange={(e) => this.onChangeAlipayAmount(_.toInteger(e.target.value) === 0 ? null : _.toInteger(e.target.value))} placeholder="请输入充值金额，最低100" />
                                        </div>
                                        <span className={[styles.default, styles.rechargeBodyBoxBodyRechargeClear].join(' ')} onClick={() => this.onChangeAlipayAmount(null)}>清除</span>
                                    </div>
                                    <div className={styles.rechargeBodyBoxBodyRechargeBody} >
                                        <span className={[styles.default, this.state.alipayAmount === 100 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(100)}>100元</span>
                                        <span className={[styles.default, this.state.alipayAmount === 200 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(200)}>200元</span>
                                        <span className={[styles.default, this.state.alipayAmount === 500 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(500)}>500元</span>
                                        <span className={[styles.default, this.state.alipayAmount === 1000 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(1000)}>1000元</span>
                                        <span className={[styles.default, this.state.alipayAmount === 2000 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(2000)}>2000元</span>
                                        <span className={[styles.default, this.state.alipayAmount === 3000 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(3000)}>3000元</span>
                                        <span className={[styles.default, this.state.alipayAmount === 5000 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(5000)}>5000元</span>
                                        <span className={[styles.default, this.state.alipayAmount === 10000 && styles.amountHover].join(' ')} onClick={() => this.onChangeAlipayAmount(10000)}>10000元</span>
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <div className={styles.rechargeBodyBoxBodyRechargeBotton}>
                            <span onClick={this.onSubmitRechargeAlipayTranser}>确定</span>
                        </div>
                        <div className={styles.rechargeBodyBoxBodyRechargeText}>
                            <p>温馨提示：如有任何疑问，请联系在线客服获取帮助</p>
                        </div>
                    </div>
                );
                break;
            case 3:     //支付宝转账
                return (
                    <div>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="充值方式" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <span onClick={() => this.onChangeRechargeType(1)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 1 && styles.amountHover].join(' ')}>微信扫码</span>
                                <span onClick={() => this.onChangeRechargeType(2)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 2 && styles.amountHover].join(' ')}>支付宝扫码</span>
                                <span onClick={() => this.onChangeRechargeType(3)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 3 && styles.amountHover].join(' ')}>支付宝转账</span>
                                <span onClick={() => this.onChangeRechargeType(4)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 4 && styles.amountHover].join(' ')}>银行卡转账</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="账户" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <div className={styles.rechargeBodyBoxBodyRechargeInputText}>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.card_num ? this.state.cashBankInfo.card_num : null)}</div>
                                <span className={[styles.default, styles.rechargeBodyBoxBodyRechargeClear].join(' ')} onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.card_num ? this.state.cashBankInfo.card_num : null))}>复制</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="姓名" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <div className={styles.rechargeBodyBoxBodyRechargeInputText}>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.name ? this.state.cashBankInfo.name : null)}</div>
                                <span className={[styles.default, styles.rechargeBodyBoxBodyRechargeClear].join(' ')} onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.name ? this.state.cashBankInfo.name : null))}>复制</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="支付宝帐号" {...formItemLayout}>
                            {getFieldDecorator('alipayBankAccount', {
                                initialValue: this.state.alipayBankAccount,
                                rules: [
                                    { required: true, message: '请输入支付宝帐号' },
                                    { pattern: /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|1[34578]\d{9}$/ , message: '支付宝帐号格式不正确' }
                                ],
                            })(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                        <Input className={styles.loginBodyBoxBodyItemInput} maxLength={20} onPressEnter={this.onSubmitRechargeAlipayBankTransfer} value={this.state.alipayBankAccount} autoComplete="off" onChange={(e) => { this.setState({ alipayBankAccount: e.target.value }) }} placeholder="请输入您的支付宝账号" />
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="真实姓名" {...formItemLayout}>
                            {getFieldDecorator('alipayBankName', {
                                initialValue: this.state.alipayBankName,
                                rules: [
                                    { required: true, message: '请输入您的真实姓名' },
                                    { pattern: /^[\u4E00-\u9FA5]{2,4}$/, message: '真实姓名应为2-4位中文' }
                                ],
                            })(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                        <Input className={styles.loginBodyBoxBodyItemInput} maxLength={6} onPressEnter={this.onSubmitRechargeAlipayBankTransfer} value={this.state.alipayBankName} autoComplete="off" onChange={(e) => { this.setState({ alipayBankName: e.target.value }) }} placeholder="请输入您的真实姓名" />
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="充值金额" {...formItemLayout}>
                            {getFieldDecorator('alipayBankAmount', {
                                initialValue: this.state.alipayBankAmount,
                                rules: [
                                    { required: true, message: '请输入充值金额，最低100' },
                                    { validator: this.validMoney }
                                ],
                            })(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                        <Input className={styles.loginBodyBoxBodyItemInput} maxLength={5} onPressEnter={this.onSubmitRechargeAlipayBankTransfer} value={this.state.alipayBankAmount} autoComplete="off" onChange={(e) => { this.setState({ alipayBankAmount: _.toInteger(e.target.value) === 0 ? null : _.toInteger(e.target.value) }) }} placeholder="请输入您的充值金额" />
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <div className={styles.rechargeBodyBoxBodyRechargeBotton}>
                            <span onClick={this.onSubmitRechargeAlipayBankTransfer}>确定</span>
                        </div>
                        <div className={styles.rechargeBodyBoxBodyRechargeText}>
                            <p>温馨提示</p>
                            <p>1.转账时请确认入款账号信息是否正确。</p>
                            <p>2.备注请填写您的账号，便于快速到账。</p>
                            <p>3.如出现充值失败或充值未到账等情况，请联系在线客服获取帮助。</p>
                        </div>
                    </div>
                );
                break;
            case 4:
                return (
                    <div>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="充值方式" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <span onClick={() => this.onChangeRechargeType(1)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 1 && styles.amountHover].join(' ')}>微信扫码</span>
                                <span onClick={() => this.onChangeRechargeType(2)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 2 && styles.amountHover].join(' ')}>支付宝扫码</span>
                                <span onClick={() => this.onChangeRechargeType(3)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 3 && styles.amountHover].join(' ')}>支付宝转账</span>
                                <span onClick={() => this.onChangeRechargeType(4)} className={[styles.default, styles.rechargeBodyBoxBodyRechargeBodyType, this.state.rechargeType === 4 && styles.amountHover].join(' ')}>银行卡转账</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="充值银行" {...formItemLayout}>
                            {getFieldDecorator('bankId', {
                                initialValue: this.state.bankId,
                                rules: [
                                    { required: true, message: '请选择您的开户银行' }
                                ],
                            })(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                        <Select style={{ width: '100%' }} placeholder="请选择您的开户银行" onChange={this.chooseBank}>
                                            {this.renderBankList()}
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="银行卡号" {...formItemLayout}>
                            {getFieldDecorator('bankNumber', {
                                initialValue: this.state.bankNumber,
                                rules: [
                                    { required: true, message: '请输入您的银行卡号' },
                                    { pattern: /^[0-9]{16,19}$/, message: '银行卡号应为16-19位的纯数字' }
                                ],
                            })(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                        <Input type="text"  maxLength={19} autoComplete="off" onChange={(e) => { this.setState({ bankNumber: _.toInteger(e.target.value) === 0 ? null : _.toInteger(e.target.value) }) }} placeholder="请输入您的银行卡号" />
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="持卡人姓名" {...formItemLayout}>
                            {getFieldDecorator('bankUserName', {
                                initialValue: this.state.bankUserName,
                                rules: [
                                    { required: true, message: '请输入您的真实姓名' },
                                    { pattern: /^[\u4E00-\u9FA5]{2,4}$/, message: '真实姓名应为2-4位中文' }
                                ],
                            })(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                        <Input type="text" value={this.state.bankUserName} autoComplete="off" onChange={(e) => { this.setState({ bankUserName: e.target.value }) }} placeholder="请输入持卡人姓名" />
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItem} label="充值金额" {...formItemLayout}>
                            {getFieldDecorator('bankTransferAmount', {
                                initialValue: this.state.bankTransferAmount,
                                rules: [
                                    { required: true, message: '请输入充值金额，最低100' },
                                    { validator: this.validMoney }
                                ],
                            })(
                                <div>
                                    <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                        <div className={styles.rechargeBodyBoxBodyRechargeInput}>
                                            <Input type="text" maxLength={5} value={this.state.bankTransferAmount} autoComplete="off" onPressEnter={this.onSubmitRechargeBank} onChange={(e) => { this.setState({ bankTransferAmount: _.toInteger(e.target.value) === 0 ? null : _.toInteger(e.target.value) }) }} placeholder="请输入充值金额，最低100" />
                                        </div>
                                        <span className={[styles.default, styles.rechargeBodyBoxBodyRechargeClear].join(' ')} onClick={() => this.onChangeBankTransferAmount(null)}>清除</span>
                                    </div>
                                    <div className={styles.rechargeBodyBoxBodyRechargeBody} >
                                        <span className={[styles.default, this.state.bankTransferAmount === 100 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(100)}>100元</span>
                                        <span className={[styles.default, this.state.bankTransferAmount === 200 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(200)}>200元</span>
                                        <span className={[styles.default, this.state.bankTransferAmount === 500 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(500)}>500元</span>
                                        <span className={[styles.default, this.state.bankTransferAmount === 1000 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(1000)}>1000元</span>
                                        <span className={[styles.default, this.state.bankTransferAmount === 2000 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(2000)}>2000元</span>
                                        <span className={[styles.default, this.state.bankTransferAmount === 3000 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(3000)}>3000元</span>
                                        <span className={[styles.default, this.state.bankTransferAmount === 5000 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(5000)}>5000元</span>
                                        <span className={[styles.default, this.state.bankTransferAmount === 10000 && styles.amountHover].join(' ')} onClick={() => this.onChangeBankTransferAmount(10000)}>10000元</span>
                                    </div>
                                </div>
                            )}
                        </Form.Item>
                        <div className={styles.rechargeBodyBoxBodyRechargeBotton}>
                            <span onClick={this.onSubmitRechargeBank}>确定</span>
                        </div>
                        <div className={styles.rechargeBodyBoxBodyRechargeText}>
                            <p>温馨提示：如有任何疑问，请联系在线客服获取帮助</p>
                        </div>
                    </div>
                );
                break;
            default:
                return null;
                break;
        }
    }


    //根据类型显示不同充值详情页面
    renderRechargeInfoByType(getFieldDecorator, formItemLayout) {
        switch (this.state.rechargeType) {
            case 1:     //微信扫码
                return (
                    <div>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="账户信息" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <div className={styles.rechargeBodyBoxBodyRechargeInputText}>{this.state.rechargeWechatInfo === null ? null : (this.state.rechargeWechatInfo.name ? this.state.rechargeWechatInfo.name : null)}</div>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="账户信息" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <div className={styles.rechargeBodyBoxBodyRechargeInputText}><img src={this.state.rechargeWechatInfo === null ? null : (this.state.rechargeWechatInfo.url ? this.state.rechargeWechatInfo.url : null)} /></div>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="附言码：" {...formItemLayout}>
                            {getFieldDecorator('wechatSubmitRecharge')(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInputText}>{this.state.rechargeWechatInfo === null ? null : (this.state.rechargeWechatInfo.fuyan ? this.state.rechargeWechatInfo.fuyan : null)}</div>
                                </div>
                            )}
                        </Form.Item>
                        <div className={styles.rechargeBodyBoxBodyRechargeBotton}>
                            <span onClick={this.sureSubmitWechartRecharge}>确定</span>
                            <span onClick={this.backSubmitWechartRecharge}>返回</span>
                        </div>
                        <div className={styles.rechargeBodyBoxBodyRechargeText}>
                            <p>温馨提示：如有任何疑问，请联系在线客服获取帮助</p>
                            <p>1.转账时请确认入款账号信息是否正确。</p>
                            <p>2.备注请写入上方附言码，便于快速到账。</p>
                            <p>3.如出现充值失败或充值未到账等情况，请联系在线客服获取帮助。</p>
                        </div>
                    </div>
                );
                break;
            case 2:
                return (
                    <div>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="账户信息" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <div className={styles.rechargeBodyBoxBodyRechargeInputText}>{this.state.rechargeAlipayInfo === null ? null : (this.state.rechargeAlipayInfo.name ? this.state.rechargeAlipayInfo.name : null)}</div>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="账户信息" {...formItemLayout}>
                            <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                <div className={styles.rechargeBodyBoxBodyRechargeInputText}><img src={this.state.rechargeAlipayInfo === null ? null : (this.state.rechargeAlipayInfo.url ? this.state.rechargeAlipayInfo.url : null)} /></div>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.rechargeBodyBoxBodyFormItemText} label="附言码：" {...formItemLayout}>
                            {getFieldDecorator('alipaySubmitRecharge')(
                                <div className={styles.rechargeBodyBoxBodyRechargeBody}>
                                    <div className={styles.rechargeBodyBoxBodyRechargeInputText}>{this.state.rechargeAlipayInfo === null ? null : (this.state.rechargeAlipayInfo.fuyan ? this.state.rechargeAlipayInfo.fuyan : null)}</div>
                                </div>
                            )}
                        </Form.Item>
                        <div className={styles.rechargeBodyBoxBodyRechargeBotton}>
                            <span onClick={this.sureSubmitAlipayRecharge}>确定</span>
                            <span onClick={this.backSubmitAlipayRecharge}>返回</span>
                        </div>
                        <div className={styles.rechargeBodyBoxBodyRechargeText}>
                            <p>温馨提示：如有任何疑问，请联系在线客服获取帮助</p>
                            <p>1.转账时请确认入款账号信息是否正确。</p>
                            <p>2.备注请写入上方附言码，便于快速到账。</p>
                            <p>3.如出现充值失败或充值未到账等情况，请联系在线客服获取帮助。</p>
                        </div>
                    </div>
                )
                break;
            case 3:
                return (
                    <div className={styles.remindersBodyBoxBody}>
                        <div className={styles.remindersBodyBoxBodyTitle}>【请转账至该银行卡完成充值】</div>
                        <div className={styles.remindersBodyBoxBodyInfo}>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>银行：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.bank_name ? this.state.cashBankInfo.bank_name : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.bank_name ? this.state.cashBankInfo.bank_name : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>账户名：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.name ? this.state.cashBankInfo.name : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.name ? this.state.cashBankInfo.name : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>卡名：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.card_num ? this.state.cashBankInfo.card_num : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.card_num ? this.state.cashBankInfo.card_num : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>开户行：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.opening_bank ? this.state.cashBankInfo.opening_bank : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.opening_bank ? this.state.cashBankInfo.opening_bank : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>金额：</span>
                                <span>{this.state.alipayBankAmount === null ? null : (this.state.alipayBankAmount ? this.state.alipayBankAmount : null)}</span>
                                <span onClick={() => this.copyClick(this.state.alipayBankAmount === null ? null : (this.state.alipayBankAmount ? this.state.alipayBankAmount : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>附言：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.fuyan ? this.state.cashBankInfo.fuyan : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.fuyan ? this.state.cashBankInfo.fuyan : null))}>复制</span>
                            </div>
                        </div>
                        <div className={styles.remindersBodyBoxBodyTitle}>提示:请一定在转账备注附言中填写该附言码，否则有可能无法收到您的款项，该附言码也是您向客服咨询的唯一凭证</div>
                        <div>
                            <span className={styles.remindersBodyBoxBodyButton} onClick={() => this.sureSubmitTransferRecharge()} >关闭</span>
                        </div>
                    </div >
                )
                break;
            case 4:
                return (
                    <div className={styles.remindersBodyBoxBody}>
                        <div className={styles.remindersBodyBoxBodyTitle}>【请转账至该银行卡完成充值】</div>
                        <div className={styles.remindersBodyBoxBodyInfo}>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>银行：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.bank_name ? this.state.cashBankInfo.bank_name : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.bank_name ? this.state.cashBankInfo.bank_name : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>账户名：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.name ? this.state.cashBankInfo.name : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.name ? this.state.cashBankInfo.name : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>卡名：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.card_num ? this.state.cashBankInfo.card_num : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.card_num ? this.state.cashBankInfo.card_num : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>开户行：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.opening_bank ? this.state.cashBankInfo.opening_bank : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.opening_bank ? this.state.cashBankInfo.opening_bank : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>金额：</span>
                                <span>{this.state.bankTransferAmount === null ? null : (this.state.bankTransferAmount ? this.state.bankTransferAmount : null)}</span>
                                <span onClick={() => this.copyClick(this.state.bankTransferAmount === null ? null : (this.state.bankTransferAmount ? this.state.bankTransferAmount : null))}>复制</span>
                            </div>
                            <div className={styles.remindersBodyBoxBodyInfoA}>
                                <span>附言：</span>
                                <span>{this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.fuyan ? this.state.cashBankInfo.fuyan : null)}</span>
                                <span onClick={() => this.copyClick(this.state.cashBankInfo === null ? null : (this.state.cashBankInfo.fuyan ? this.state.cashBankInfo.fuyan : null))}>复制</span>
                            </div>
                        </div>
                        <div className={styles.remindersBodyBoxBodyTitle}>提示:请一定在转账备注附言中填写该附言码，否则有可能无法收到您的款项，该附言码也是您向客服咨询的唯一凭证</div>
                        <div>
                            <span className={styles.remindersBodyBoxBodyButton} onClick={() => this.sureSubmitTransferRecharge()} >关闭</span>
                        </div>
                    </div>
                )
                break;
            default:
                return null;
                break;
        }
    }

    render() {
        const { fastRechargeBox, loading, form } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'40vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={fastRechargeBox}
                onCancel={() => this.hideFastRechargeView()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <Form layout="horizontal">
                        <div className={styles.rechargeBox}>
                            <div className={styles.rechargeBody}>
                                <div className={styles.rechargeBodyBox}>
                                    <div className={styles.rechargeBodyBoxTitle}>充值</div>
                                    <div className={[styles.rechargeBodyBoxBody, styles.rechargeBodyBoxBodyFlex].join(' ')}>
                                        {
                                            this.state.rechargeResultInfoBox
                                                ?
                                                this.renderRechargeInfoByType(getFieldDecorator, formItemLayout)
                                                :
                                                this.renderRechargeViewByType(getFieldDecorator, formItemLayout)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </Modal >
        )
    }
}
const RechargeView = Form.create({ name: 'RechargeView' })(RechargeForm);
function mapStateToProps(state) {
    return {
        fastRechargeBox: state.recharge.fastRechargeBox,
        loading: state.loading.effects[
            'recharge/changeFastRechargeBox',
            'recharge/getWechatRechargeQrcode',
            'recharge/sureWechatRecharge',
            'recharge/getWechatRechargePayment',
            'recharge/changeBankRechargeBox'
        ] || false
    }
}

export default connect(mapStateToProps)(RechargeView);


