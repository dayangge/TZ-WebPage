import { connect } from 'dva';
import { Modal, Divider } from 'antd';
import styles from '../style/loginView.css';

class RegisterRuleView extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
    }

    hideRegisterRuleView() {
        this.props.dispatch({
            type: 'login/changeRegisterRuleBox',
            payload: false
        });
        this.props.dispatch({
            type: 'login/changeRegisterBox',
            payload: true
        });
    }

    render() {
        const { registerRuleBox } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'60vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={registerRuleBox}
                onCancel={() => this.hideRegisterRuleView()}
            >
                <div className={styles.loginBox}>
                    <div className={styles.loginBody}>
                        <div className={styles.loginBodyBox}>
                            <div className={styles.loginBodyBoxTitle}>开户协议</div>
                            <div className={styles.loginBodyBoxBody}>
                                <div className={styles.loginBodyBoxBodyText}>
                                    <p>天子棋牌只接受合法博彩年龄的客户申请。同时我们保留要求客户提供其年龄证明的权利。</p>
                                    <p>在天子棋牌进行注册时所提供的全部信息必须在各个方面都是准确和完整的。在使用借记卡或信用卡时，持卡人的姓名必须与在网站上注册时的一致。</p>
                                    <p>成为天子棋牌有效会员后，客户有责任以电邮、联系在线客服、在天子棋牌网站上留言等方式，随时向本公司提供最新的个人资料。</p>
                                    <p>经天子棋牌发现会员有重复申请账号行为时，有权将这些账户视为一个联合账户。我们保留取消、收回会员所有优惠红利，以及优惠红利所产生的盈利之权利。每位玩家、每一住址、每一电子邮箱、每一电话号码、相同支付卡/信用卡号码，以及共享计算机环境 (例如:网吧、其他公共用计算机等)只能够拥有一个会员账号，各项优惠只适用于每位客户在天子棋牌唯一的账户。</p>
                                    <p>天子棋牌是提供互联网投注服务的机构。请会员在注册前参考当地政府的法律，在博彩不被允许的地区，如有会员在天子棋牌注册、下注，为会员个人行为，天子棋牌不负责、承担任何相关责任。</p>
                                    <p>无论是个人或是团体，如有任何威胁、滥用天子棋牌优惠的行为，天子棋牌保留杈利取消、收回由优惠产生的红利，并保留权利追讨最高50%手续费。</p>
                                    <p>所有天子棋牌的优惠是特别为玩家而设，在玩家注册信息有争议时，为确保双方利益、杜绝身份盗用行为，天子棋牌保留权利要求客户向我们提供充足有效的文件， 并以各种方式辨别客户是否符合资格享有我们的任何优惠。</p>
                                    <p>客户一经注册开户，将被视为接受所有颁布在天子棋牌网站上的规则与条例。</p>
                                    <Divider />
                                </div>
                            </div>
                            <div className={styles.loginBodyBoxButton}>
                                <span onClick={() => this.hideRegisterRuleView()} className={styles.loginButton}>返回开户</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}


function mapStateToProps(state) {
    return {
        registerRuleBox: state.login.registerRuleBox
    }
}

export default connect(mapStateToProps)(RegisterRuleView);