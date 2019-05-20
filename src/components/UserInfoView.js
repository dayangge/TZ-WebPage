import { connect } from 'dva';
import { Modal } from 'antd';
import styles from '../style/userinfo.css';
import header from '../assets/f_ico1.png';
import storage from '../utils/localStorage';
class UserInfoView extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {

    }

    hideUserInfoBox() {
        this.props.dispatch({
            type: 'userinfo/changeUserInfoBox',
            payload: false
        });
    }
    showMessage() {
        this.props.dispatch({
            type: 'userinfo/changeUserInfoBox',
            payload: false
        });
        this.props.dispatch({
            type: 'message/changeMyMessageBox',
            payload: true
        });
    }
    showRecharge() {
        this.props.dispatch({
            type: 'userinfo/changeUserInfoBox',
            payload: false
        });
        this.props.dispatch({
            type: 'recharge/changeFastRechargeBox',
            payload: true
        });
    }
    showWithdrawal() {
        this.props.dispatch({
            type: 'userinfo/changeUserInfoBox',
            payload: false
        });
        this.props.dispatch({
            type: 'withdrawals/changeCashWithdrawalBox',
            payload: true
        });
    }

    render() {
        const { userInfoBox } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'25vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={userInfoBox}
                onCancel={() => this.hideUserInfoBox()}
            >
                <div className={styles.userInfoBox}>
                    <div className={styles.userInfoBody}>
                        <div className={styles.userInfoBodyBox}>
                            <div className={styles.userInfoBodyBoxBody}>
                                <div className={styles.userInfoBodyBoxBodyInfo}>
                                    <div className={styles.userInfoBodyBoxBodyInfoHeader}>
                                        <img src={header} />
                                    </div>
                                    <div className={styles.userInfoBodyBoxBodyInfoBody}>
                                        <p>帐号：{JSON.parse(storage.get('user')).account}</p>
                                        <p>金币：{JSON.parse(storage.get('user')).total}元</p>
                                        <p>推荐码：{JSON.parse(storage.get('user')).agent_id ? JSON.parse(storage.get('user')).agent_id : null}</p>
                                    </div>
                                </div>
                                <div className={styles.userInfoBodyBoxBodyButton}>
                                    <span className={styles.message} onClick={()=>this.showMessage()}>站内信</span>
                                    <span className={styles.recharge} onClick={() =>this.showRecharge()}>充 值</span>
                                    <span className={styles.withdrawal} onClick={() =>this.showWithdrawal()}>提 现</span>
                                </div>
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
        userInfoBox: state.userinfo.userInfoBox
    }
}

export default connect(mapStateToProps)(UserInfoView);