import React, { Component } from 'react';
import styles from '../style/qznnPage.css';
import { connect } from 'dva';
class QznnPage extends Component {
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
            param.gameId = 830;
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
            <div className={styles.qznnBox}>
                <div className={styles.qznnCharacter}/>
                <div className={styles.qznnCharacter1}/>
                <div className={styles.qznnMoneyOne} />
                <div className={styles.qznnMoneyTwo}/>
                <div className={styles.qznnMoneyThree}/>
                <div className={styles.qznnMoneyFour}/>
                <div className={styles.qznnMoneyFive}/>
                <div className={styles.qznnMoneySix}/>
                <div className={styles.qznnBoxInfo} >
                    <div className={styles.title}>游戏起源</div>
                    <div className={styles.body}>“牛牛”又称“斗牛”作为扑克牌的泛生游戏，最早出现于宋朝湖广一带，并在这个区域流行开来，后经过变迁，流传到各个区域，现在各个区域都有自己地域风俗的牛牛玩法。快速、简单、便捷、这是牛牛玩法的特色。现在牛牛已经成为人们之中最火爆的一种扑克玩法，“抢庄牛牛”更是增加了自己独有的庄家玩法。</div>
                </div>
                <div className={styles.qznnBoxButton} onClick={this.showGameIframe.bind(this, loginStatus)}>进入游戏</div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(QznnPage);