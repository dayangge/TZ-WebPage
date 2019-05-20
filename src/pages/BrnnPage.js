import React, { Component } from 'react';
import styles from '../style/brnnPage.css';
import { connect } from 'dva';
class brnnPage extends Component {
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
            param.gameId = 10015;
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
            <div className={styles.brnnBox}>
                <div className={styles.brnnImg1} />
                <div className={styles.brnnImg2} />
                <div className={styles.brnnIco2} />
                <div className={styles.brnnIco3} />
                <div className={styles.brnnBoxInfo} >
                    <div className={styles.title}>游戏起源</div>
                    <div className={styles.body}>“牛牛”的泛生豪华版游戏，是可以同时满足上百人进行的简单押注类扑克游戏，在江浙一带流行开来。满足坐庄条件的玩家即可坐庄，闲家分别与庄家比较牌型大小定胜负，与其他闲家无任何关系。 由于该游戏简单有趣且上手极快娱乐性强的特点，广受扑克爱好者们的青睐。</div>
                </div>
                <div className={styles.brnnBoxButton} onClick={this.showGameIframe.bind(this, loginStatus)}>进入游戏</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(brnnPage);