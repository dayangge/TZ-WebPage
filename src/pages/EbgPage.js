import styles from '../style/ebgPage.css';
import { connect } from 'dva';
class EbgPage extends React.Component {
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
            param.gameId = 720;
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
            <div className={styles.ebgBox}>
                 <div className={styles.ebgMain} />
                <div className={styles.ebgLeft} />
                <div className={styles.ebgCenter} />
                <div className={styles.ebgRight} />
                <div className={styles.ebgFlower1}/>
                <div className={styles.ebgFlower2}/>
                <div className={styles.ebgFlower3}/>
                <div className={styles.ebgFlower4}/>
                <div className={styles.ebgFlower5}/>
                <div className={styles.ebgBoxInfo} >
                    <div className={styles.title}>游戏起源</div>
                    <div className={styles.body}>麻将牌又称麻雀牌，古时本是“护粮牌”。曾有皇家大粮仓，常年囤积稻谷，以供“南粮北调”。粮多自然雀患频生，因雀患损失了不少粮食。管理粮仓的官吏为了奖励捕雀护粮者，便以竹牌记捕雀数目，凭此发放酬金，这就是“护粮牌”。这种竹牌，既可游戏，也可作兑取奖金的凭证。经过长久演变，渐渐演变成各种游戏，二八杠便是这其中之一。</div>
                </div>
                <div className={styles.ebgBoxButton} onClick={this.showGameIframe.bind(this, loginStatus)}>进入游戏</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(EbgPage);