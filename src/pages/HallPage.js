import styles from '../style/hallPage.css';
import { connect } from 'dva';
class HallPage extends React.Component {
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
            param.gameId = -1;
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
            <div className={styles.hallBox}>
                <div className={styles.hallBoxInfo} >
                    <div className={styles.title}>游戏大厅</div>
                    <div className={styles.body}>
                        <p>欢迎光临游戏大厅。</p>
                        <p>找你所想，想你所要。</p>
                        <p>德州扑克，百人牛牛。</p>
                        <p>欢乐炸金花，娱乐二八杠。</p>
                        <p>纵观龙争虎斗，齐看百家欢乐。</p>
                        <p>这里是天子游戏大厅。</p>
                    </div>
                </div>
                <div className={styles.hallBoxButton} onClick={this.showGameIframe.bind(this, loginStatus)}>进入游戏</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(HallPage);