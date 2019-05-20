import { connect } from 'dva';
import styles from 'style/rightMenuView.css';


class RightMenuView extends React.Component {
    constructor() {
        super();
        this.state = {
            menuKeys: null
        }
    }

    componentDidMount() {
    }

    onLoginOut = () => {
        this.props.dispatch({
            type: 'login/logout'
        });
        this.props.dispatch({
            type: 'common/changeMenuStatus',
            payload: false
        });
    }

    onChangeMenuKey = (key) => {
        this.props.dispatch({
            type: 'common/changeMenuKeys',
            payload: key
        });
    }

    showModal = (value) => {
        switch (value) {
            case 'fastRecharge': //快速充值
                this.props.dispatch({
                    type: 'recharge/changeFastRechargeBox',
                    payload: true
                });
                break;
            case 'cashWithdrawal': //立即提现
                this.props.dispatch({
                    type: 'withdrawals/changeCashWithdrawalBox',
                    payload: true
                });
                break;
            case 'goldTransfer': //金币转账
                this.props.dispatch({
                    type: 'gold/changeGoldTransferBox',
                    payload: true
                });
                break;
            case 'rechargeRecord': //充值记录
                this.props.dispatch({
                    type: 'recharge/changeRechargeRecordBox',
                    payload: true
                });
                break;
            case 'withdrawalsRecord': //提现记录
                this.props.dispatch({
                    type: 'withdrawals/changeWithdrawalsRecordBox',
                    payload: true
                });
                break;
            case 'transferRecord': //转账记录
                this.props.dispatch({
                    type: 'gold/changeTransferRecordBox',
                    payload: true
                });
                break;
            case 'gameRecord': //游戏记录
                this.props.dispatch({
                    type: 'gameRecord/changeGameRecordBox',
                    payload: true
                });
                break;
            case 'myMessage': //我的消息
                this.props.dispatch({
                    type: 'message/changeMyMessageBox',
                    payload: true
                });
                break;
            case 'bankCard': //银行卡
                this.props.dispatch({
                    type: 'bankCard/changeBankCardBox',
                    payload: true
                });
                break;
            case 'loginPassword': //登录密码
                this.props.dispatch({
                    type: 'user/changeLoginPassBox',
                    payload: true
                });
                break;
            case 'fundPassword': //资金密码
                this.props.dispatch({
                    type: 'user/changeFundPassBox',
                    payload: true
                });
                break;
            case 'agencyRelationship': //代理关系
                this.props.dispatch({
                    type: 'agency/changeAgencyRelationshipBox',
                    payload: true
                });
                break;
            case 'agencyTransfer': //代理转账
                this.props.dispatch({
                    type: 'agency/changeAgencyTransferBox',
                    payload: true
                });
                break;
            case 'agencyTransferRecord': //转账记录
                this.props.dispatch({
                    type: 'agency/changeAgencyTransferRecordBox',
                    payload: true
                });
                break;
            default:
            case 'rechargeRecord':
                this.props.dispatch({
                    type: 'rechargeRecord/changeRechargeRecordBox',
                    payload: true
                });
                break;
        }
    }

    render() {
        const { menuStatus, menuKeys } = this.props;
        return (
            <div className={styles.drawerBox}>
                <div className={styles.menuBox}>
                    <div onClick={this.onChangeMenuKey.bind(this, menuKeys === 1 ? null : 1)} className={[styles.menuBoxItem, styles.menuBoxItemA, menuStatus && styles.menuBoxItemRight].join(' ')}>资金<br />管理</div>
                    <div onClick={this.onChangeMenuKey.bind(this, menuKeys === 2 ? null : 2)} className={[styles.menuBoxItem, styles.menuBoxItemB, menuStatus && styles.menuBoxItemRight].join(' ')}>财务<br />报表</div>
                    <div onClick={this.onChangeMenuKey.bind(this, menuKeys === 3 ? null : 3)} className={[styles.menuBoxItem, styles.menuBoxItemC, menuStatus && styles.menuBoxItemRight].join(' ')}>账户<br />资料</div>
                    <div onClick={this.onChangeMenuKey.bind(this, menuKeys === 4 ? null : 4)} className={[styles.menuBoxItem, styles.menuBoxItemD, menuStatus && styles.menuBoxItemRight].join(' ')}>代理<br />管理</div>
                    <div onClick={this.onLoginOut} className={[styles.menuBoxItem, styles.menuBoxItemE, menuStatus && styles.menuBoxItemRight].join(' ')}>退出<br />登录</div>
                </div>
                <div className={styles.menuLiBox}>
                    <div className={[styles.menuLiBoxItem, styles.menuLiBoxItemA].join(' ')}>
                        <div onClick={this.showModal.bind(this, 'fastRecharge')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiA, menuKeys === 1 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>快速充值</div>
                        <div onClick={this.showModal.bind(this, 'cashWithdrawal')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiB, menuKeys === 1 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>立即提现</div>
                        <div onClick={this.showModal.bind(this, 'goldTransfer')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiC, menuKeys === 1 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>金币转账</div>
                    </div>
                    <div className={[styles.menuLiBoxItem, styles.menuLiBoxItemB].join(' ')}>
                        <div onClick={this.showModal.bind(this, 'rechargeRecord')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiA, menuKeys === 2 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>充值记录</div>
                        <div onClick={this.showModal.bind(this, 'withdrawalsRecord')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiB, menuKeys === 2 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>提现记录</div>
                        <div onClick={this.showModal.bind(this, 'transferRecord')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiC, menuKeys === 2 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>转账记录</div>
                        <div onClick={this.showModal.bind(this, 'gameRecord')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiD, menuKeys === 2 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>游戏记录</div>
                    </div>
                    <div className={[styles.menuLiBoxItem, styles.menuLiBoxItemC].join(' ')}>
                        <div onClick={this.showModal.bind(this, 'myMessage')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiA, menuKeys === 3 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>我的消息</div>
                        <div onClick={this.showModal.bind(this, 'bankCard')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiB, menuKeys === 3 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>银行卡</div>
                        <div onClick={this.showModal.bind(this, 'loginPassword')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiC, menuKeys === 3 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>登录密码</div>
                        <div onClick={this.showModal.bind(this, 'fundPassword')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiD, menuKeys === 3 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>资金密码</div>
                    </div>
                    <div className={[styles.menuLiBoxItem, styles.menuLiBoxItemD].join(' ')}>
                        <div onClick={this.showModal.bind(this, 'agencyRelationship')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiA, menuKeys === 4 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>代理关系</div>
                        <div onClick={this.showModal.bind(this, 'agencyTransfer')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiB, menuKeys === 4 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>代理转账</div>
                        <div onClick={this.showModal.bind(this, 'agencyTransferRecord')} className={[styles.menuLiBoxItemLi, styles.menuLiBoxItemLiC, menuKeys === 4 && menuStatus && styles.menuLiBoxItemRight].join(' ')}>转账记录</div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        menuStatus: state.common.menuStatus,
        menuKeys: state.common.menuKeys
    }
}

export default connect(mapStateToProps)(RightMenuView);