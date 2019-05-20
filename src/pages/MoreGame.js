import styles from '../style/MoreGame.css';
import { connect } from 'dva';

import ico1 from '../assets/more_ico_1.png';
import ico2 from '../assets/more_ico_2.png';
import ico3 from '../assets/more_ico_3.png';

class MoreGame extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
    }



    showGameIframe = (loginStatus,gameId) => {
        if (loginStatus) {
            let param = {};
            param.gameId = gameId;
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
            <div className={styles.moreGameBox}>
                <div className={styles.moreGameItem}>
                    <div className={styles.moreGameItemTitle}>斗地主</div>
                    <div className={styles.moreGameItemBody}>
                        <p>过去，地主欺农民，横乡里，农民辛苦耕种，大半粮食却交了赋税，农民对地主恨之入骨。为泄愤恨，有人将扑克游戏改编，形成了斗地主，当农民作完活回家，便玩起斗地主，以此泄恨。</p>
                    </div>
                    <div className={styles.moreGameItemImg}><img src={ico1} /></div>
                    <div className={styles.moreGameItemButton} onClick={this.showGameIframe.bind(this, loginStatus, 10005)}>进入游戏</div>
                </div>
                <div className={styles.moreGameItem}>
                    <div className={styles.moreGameItemTitle}>奔驰宝马</div>
                    <div className={styles.moreGameItemBody}>
                        <p>新兴游戏，允许游戏者使用属于自己的爱车，为强者特别准备的排行榜，更具有挑战性的赛道以及来自于世界各地强劲的对手，希望玩家在这里可以找到属于自己的那片赛车天地。</p>
                    </div>
                    <div className={styles.moreGameItemImg}><img src={ico2} /></div>
                    <div className={styles.moreGameItemButton} onClick={this.showGameIframe.bind(this, loginStatus, 10010)}>进入游戏</div>
                </div>
                <div className={styles.moreGameItem}>
                    <div className={styles.moreGameItemTitle}>龙虎斗</div>
                    <div className={styles.moreGameItemBody}>
                        <p>起源湖广地区，扑克牌游戏的泛生游戏。游戏内玩家可以选择自己的最喜欢动物，在龙与虎之间抉择最强的生物。龙虎相逐，干戈事争。见证刺激的龙虎之争，体验到龙虎风云的争斗。</p>
                    </div>
                    <div className={styles.moreGameItemImg}><img src={ico3} /></div>
                    <div className={styles.moreGameItemButton} onClick={this.showGameIframe.bind(this, loginStatus, 10025)}>进入游戏</div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(MoreGame);