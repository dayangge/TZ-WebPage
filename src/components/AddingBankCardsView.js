import { connect } from 'dva';
import { Modal, Spin, Select, Input, Form } from 'antd';
import styles from '../style/loginView.css';
const Option = Select.Option;
class AddingBankCardsForm extends React.Component {
    constructor() {
        super();
        this.state = {
            bankList: [],
            provinceList: [],
            cityList: []
        }
    }

    componentDidMount() {
        this.onGetBankList();
        this.onGetProvinceList();
    }

    onGetBankList() {
        this.props.dispatch({   //银行
            type: 'common/getBankList',
            payload: null,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        bankList: res
                    });
                }
            }
        });
    }

    onGetProvinceList() {  //省份
        this.props.dispatch({
            type: 'common/getProvinceList',
            payload: null,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        provinceList: res
                    });
                }
            }
        });
    }

    changeProvince = (value) => {    //市
        let params = {};
        params.province_id = value;
        this.props.dispatch({
            type: 'common/getCityList',
            payload: params,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        cityList: res
                    });
                }
            }
        });
    }

    hideAddBankCardBox() {
        this.props.dispatch({
            type: 'bankCard/changeAddBankCardBox',
            payload: false
        });
    }

    renderBankList() {    //银行
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

    renderProvinceList() {   //省份
        if (this.state.provinceList.length > 0) {
            let views = [];
            let provinceList = this.state.provinceList;
            for (let i = 0; i < provinceList.length; i++) {
                const item = provinceList[i];
                views.push(<Option key={i + 1} value={item.id}>{item.name}</Option>);
            }
            return views;
        } else {
            return null;
        }
    }

    renderCityList() {  //市
        if (this.state.cityList.length > 0) {
            let views = [];
            let cityList = this.state.cityList;
            for (let i = 0; i < cityList.length; i++) {
                const item = cityList[i];
                views.push(<Option key={i + 1} value={item.id}>{item.name}</Option>);
            }
            return views;
        } else {
            return null;
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'bankCard/addBankCard',
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
                            this.props.dispatch({
                                type: 'bankCard/changeAddBankCardBox',
                                payload: false
                            });
                            this.props.dispatch({
                                type: 'bankCard/changeBankCardBox',
                                payload: true
                            });
                        }
                    }
                });
            }
        })
    }

    render() {
        const { addBankCardBox, form, loading } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={addBankCardBox}
                onCancel={() => this.hideAddBankCardBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.loginBox}>
                        <div className={styles.loginBody}>
                            <div className={styles.loginBodyBox}>
                                <div className={styles.loginBodyBoxTitle}>添加银行卡</div>
                                <div className={styles.loginBodyBoxBody}>
                                    <Form.Item className={styles.loginBodyBoxBodyItem} >
                                        {getFieldDecorator('bank_id', {
                                            rules: [{ required: true, message: '请选择您的开户银行' }],
                                        })(
                                            <Select style={{ width: '100%' }} placeholder="请选择您的开户银行" onPressEnter={this.handleSubmit}>
                                                {this.renderBankList()}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.loginBodyBoxBodyItem}>
                                        {getFieldDecorator('province_key', {
                                            rules: [{ required: true, message: '请选择您的开户省份' }],
                                        })(
                                            <Select style={{ width: '100%' }} placeholder="请选择开户省份" onChange={this.changeProvince} onPressEnter={this.handleSubmit}>
                                                {this.renderProvinceList()}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.loginBodyBoxBodyItem}>
                                        {getFieldDecorator('city_key', {
                                            rules: [{ required: true, message: '请选择您的开户城市' }],
                                        })(
                                            <Select style={{ width: '100%' }} placeholder="请选择开户城市" onPressEnter={this.handleSubmit}>
                                                {this.renderCityList()}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.loginBodyBoxBodyItem}>
                                        {getFieldDecorator('address', {
                                            rules: [{ required: true, message: '请输入您的开户行地址' }],
                                        })(
                                            <Input placeholder="请输入您的开户地址" autoComplete="off" onPressEnter={this.handleSubmit} />
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.loginBodyBoxBodyItem}>
                                        {getFieldDecorator('username', {
                                            rules: [
                                                { required: true, message: '请输入您的开户行姓名' },
                                                { pattern: /^[\u4E00-\u9FA5]{2,4}$/, message:'开户姓名应为2-4位中文'}
                                            ],
                                        })(
                                            <Input placeholder="请输入您的开户行姓名" maxLength={10} autoComplete="off" onPressEnter={this.handleSubmit} />
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.loginBodyBoxBodyItem}>
                                        {getFieldDecorator('account', {
                                            rules: [
                                                { required: true, message: '请输入您的银行卡号' },
                                                { pattern: /^[0-9]{16,19}$/, message: '银行卡号应为16-19位的纯数字' }
                                            ],
                                        })(
                                            <Input placeholder="请输入您的银行卡号" maxLength={19} autoComplete="off" onPressEnter={this.handleSubmit} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className={styles.loginBodyBoxButton}>
                                    <span onClick={this.handleSubmit} className={styles.loginButton}>添加</span>
                                    <span className={styles.registerButton} onClick={() => this.hideAddBankCardBox()}>取消</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        )
    }
}
const AddingBankCardsView = Form.create({ name: 'AddingBankCardsView' })(AddingBankCardsForm);
function mapStateToProps(state) {
    return {
        addBankCardBox: state.bankCard.addBankCardBox,
        loading: state.loading.effects['bankCard/addBankCard'] || false
    }
}

export default connect(mapStateToProps)(AddingBankCardsView);