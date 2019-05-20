import styles from '../style/zjhPage.css';
import { connect } from 'dva';
class ZjhPage extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
    }

    showGameIframe = (loginStatus) => {
        if (loginStatus) {
            let param = {};
            param.gameId = 10205;
            this.props.dispatch({
                type: 'game/getGameUrl',
                payload: param
            });
        } else {
            this.props.dispatch({
                type: 'login/changeLoginBox',
                payload: true
            });
        }
    }

    render() {
        const { loginStatus } = this.props;
        return (
            <div className={styles.zjhBox}>
                <div className={styles.fireworks} />
                <div className={styles.fireworksTow} />
                <div className={styles.moneyOne} />
                <div className={styles.moneyTwo}/>
                <div className={styles.moneyThree}/>
                <div className={styles.moneyFour}/>
                <div className={styles.moneyFive}/>
                <div className={styles.moneySix}/>
                <div className={styles.moneySeven}/>
                <div className={styles.zjhBoxInfo} >
                    <div className={styles.title}>游戏起源</div>
                    <div className={styles.body}>扑克牌最为一种流传最广的游戏，最初记载出现于13世纪的埃及。我国在商周时期，便有了扑克牌的雏形，后经过几千年传承，全世界都流传着扑克牌，更演化成多种游戏。“金花”是游戏的名字，“诈”字却是一场游戏中心理的博弈。在游戏中，胆量比牌更加重要。很多时候，赢家往往只是胆量最大的。</div>
                </div>
                <div className={styles.zjhBoxButton} onClick={this.showGameIframe.bind(this, loginStatus)}>进入游戏</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(ZjhPage);