import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Divider, Form, Checkbox,Tabs,Radio} from 'antd';
import styles from '../style/loginView.css';
import storage from 'utils/localStorage';

class AgencyRuleView extends Component {
    constructor() {
        super();
        this.state = {
            agentId:1
        }
    }

    componentDidMount() {
    }

    hideAgencyRuleView() {
        this.props.dispatch({
            type: 'agency/changeAgencyRuleBox',
            payload: false
        });
    }

    handleSubmit = (e) => {
        let userInfoString = storage.get('user');
        let userInfoObject = JSON.parse(userInfoString);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!values.remember) {
                    this.props.form.setFields({
                        remember: {
                            value: values.remember,
                            errors: [new Error('请确认已知晓代理协议')],
                        },
                    });
                } else {
                    this.props.dispatch({
                        type: 'agency/applyToBeAgent',
                        payload: {type:values.type},
                        callback: (res) => {
                            if (res.errorCode && res.errorCode !== 1) {
                                this.props.form.setFields({
                                    remember: {
                                        value: values.remember,
                                        errors: [new Error(res.errorMsg || '未知错误')],
                                    },
                                });
                            } else {
                                userInfoObject.agent_id = res;
                                storage.add('user', userInfoObject);
                                this.props.dispatch({
                                    type: 'agency/changeAgencyRuleBox',
                                    payload: false
                                });
                                this.props.dispatch({
                                    type: 'agency/changeAgencyRelationshipBox',
                                    payload: true
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    render() {
        const { agencyRuleBox, form } = this.props;
        const { getFieldDecorator } = form;
        const TabPane = Tabs.TabPane;
        function callback(key) {
            console.log(key);
          }          
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'60vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={agencyRuleBox}
                onCancel={() => this.hideAgencyRuleView()}
            >
                <Form>
                    <div className={styles.loginBox}>
                        <div className={styles.loginBody}>
                            <div className={styles.loginBodyBox}>
                                <div className={styles.loginBodyBoxTitle}>代理协议</div>
                                <div className={styles.loginBodyBoxBody}>
                                    <div className={styles.loginBodyBoxBodyText}>
                                        <p>天子棋牌是国际一流高质量游戏平台，拥有最强大的资金和技术支持，誉享全球。天子棋牌拥有多元化的产品，使用最公平、公正、公开的平台，在市场上的众多博彩网站中，我们自豪的提供会员最优惠的回馈，给予合作伙伴最优势的营利回报! 无论您拥有的是网络资源，或是人脉资源，都欢迎您来加入天子棋牌合作伙伴的行列，无须负担任何费用，就可以开始无上限的收入。天子棋牌绝对是您最聪明的选择!</p>
                                        <p>成为代理你可以得到：</p>
                                        <p>1.高额的代理佣金，让你轻松月入百万</p>
                                        <p>2.多层级佣金分配方式，邀请越多，收入越高</p>
                                        <p>3.零风险，高回报，每月准时出佣</p>
                                        <p>4.玩法多多，满足各种类型玩家需求</p>
                                        <p>5.提款快速金额不封顶，实力雄厚</p>
                                        <p>6.营运多年，用户过万，深受玩家爱戴</p>
                                        <p>7.数据信息详尽，可查阅下线投注记录</p>
                                        <p>还等什么？马上加盟吧。注册加入，开始推广，赚取佣金，简单三步开始成就梦想之旅。</p>
                                        <p>申请成为代理时可自由选择A/B两种方式成为代理:</p>
                                        <Tabs defaultActiveKey="1" onChange={callback}>
                                            <TabPane className="selected" tab="代理方案A" key="1">
                                                <table style={{margin:'1vh 0', textAlign: 'center',width:'100%',color:'white'}}>
                                                <thead >
                                                    <tr>
                                                        <th>当月盈利</th>
                                                        <th>当月最低有效会员</th>
                                                        <th>佣金比例（阶梯式）</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1-20000</td>
                                                        <td>1或以上</td>
                                                        <td>6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>20001~50000</td>
                                                        <td>3或以上</td>
                                                        <td>7%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>50001~100000</td>
                                                        <td>5或以上</td>
                                                        <td>8%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>100001~500000</td>
                                                        <td>10或以上</td>
                                                        <td>9%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>500000以上</td>
                                                        <td>50或以上</td>
                                                        <td>10%</td>
                                                    </tr>
                                                </tbody>
                                                </table>
                                                <p>当周佣金获取前提条件：</p>
                                                <p>1.	当周线下至少有1位有效投注会员参与投注。</p>
                                                <p>2.	当周有效投注额达到1000为有效会员。</p>
                                                <p>3.	每周礼拜三发放代理佣金，在1个工作日内将佣金存入您的代理账号内，您随时可申请取款。</p>
                                                <p>4.	如代理账号邀请的会员也成为代理，则该代理账号将会额外得到该会员的部分佣金收益。</p>
                                                <p>例1：账号A成为代理后邀请B/C/D三个账号，其中账号B也为代理；若账号B本周可拿200元佣金，因账号B为账号A下线，本周账号B佣金为200元，账号A可得额外佣金20元。</p>
                                                <p>例2：账号A成为代理后邀请B/C/D三个账号，其中账号B也为代理，账号B邀请E/F/G三个账号，账号F也为代理；若账号F本周可拿200元佣金，因账号F为账号B下线，账号B为账号A下线，本周账号F佣金为200元，账号B佣金为10元，账号A佣金为10元。</p>
                                            </TabPane>
                                            <TabPane className="selected" tab="代理方案B" key="2">
                                            <table style={{margin:'1vh 0', textAlign: 'center',width:'100%',color:'white'}}>
                                                <thead >
                                                    <tr>
                                                        <th>当月盈利</th>
                                                        <th>当月最低有效会员</th>
                                                        <th>佣金比例（阶梯式）</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1-20000</td>
                                                        <td>1或以上</td>
                                                        <td>0.6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>20001~50000</td>
                                                        <td>3或以上</td>
                                                        <td>0.7%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>50001~100000</td>
                                                        <td>5或以上</td>
                                                        <td>0.8%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>100001~500000</td>
                                                        <td>10或以上</td>
                                                        <td>0.9%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>500001以上</td>
                                                        <td>50或以上</td>
                                                        <td>1%</td>
                                                    </tr>
                                                </tbody>
                                                </table>
                                                <p>当周佣金获取前提条件：</p>
                                                <p>1.	当周线下至少有1位有效投注会员参与投注。</p>
                                                <p>2.	当周有效投注额达到1000为有效会员。</p>
                                                <p>3.	每周礼拜三发放代理佣金，在1个工作日内将佣金存入您的代理账号内，您随时可申请取款。</p>
                                                <p>4.	如代理账号邀请的会员也成为代理，则该代理账号将会额外得到该会员的部分佣金收益。</p>
                                                <p>例1：账号A成为代理后邀请B/C/D三个账号，其中账号B也为代理；若账号B本周可拿200元佣金，因账号B为账号A下线，本周账号B佣金为200元，账号A佣金为200*30%=60元。</p>
                                                <p>例2：账号A成为代理后邀请B/C/D三个账号，其中账号B也为代理，账号B邀请E/F/G三个账号，账号F也为代理；若账号F本周可拿200元佣金，因账号F为账号B下线，账号B为账号A下线，本周账号F佣金为200元，账号B佣金为200*30%=60元，账号A佣金为200*30%*30%=18元。</p>
                                            </TabPane>
                                        </Tabs>
                                        <Divider />
                                        <p>注：请谨记任何使用不诚实方法以骗取代理佣金者将取消代理资格并永久冻结账户，佣金一概不给予派发！天子棋牌保留上述条例之最终更改权！</p>
                                        <p>免责声明：</p>
                                        <p>1. 我们将保留随时更改佣金比例及计算方式的权力。</p>
                                        <p>2. 如有需要，天子棋牌也有权改变、修正或增加任何条款，且不需要任何理由或者提前通知。</p>
                                        <p>3. 如果合作伙伴在规定的时间内不符合我们的预期的表现，天子棋牌有权随时取消合作伙伴帐户，而不需要任何理由或提前通知。</p>
                                        <Divider />
                                    </div>

                                    <Form.Item className={styles.loginBodyBoxBodyItem} label="请选择代理方案">
                                        {getFieldDecorator('type', {
                                            rules: [{ required: true, message: '请确认已选择代理方案' }],
                                        })(
                                            <Radio.Group buttonStyle="solid">
                                            <Radio.Button value={1}>方案A</Radio.Button>
                                            <Radio.Button value={2}>方案B</Radio.Button>
                                        </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <Form.Item className={styles.loginBodyBoxBodyItem}>
                                        {getFieldDecorator('remember', {
                                            rules: [{ required: true, message: '请确认已知晓代理协议' }],
                                        })(
                                            <Checkbox className={styles.checboxStyle}>我已知晓代理协议，而不需要任何理由或提前通知。</Checkbox>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className={styles.loginBodyBoxButton}>
                                    <span onClick={this.handleSubmit} className={styles.loginButton}>成为代理</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const AgencyRuleForm = Form.create({ name: 'AgencyRuleForm' })(AgencyRuleView);

function mapStateToProps(state) {
    return {
        agencyRuleBox: state.agency.agencyRuleBox
    }
}

export default connect(mapStateToProps)(AgencyRuleForm);

