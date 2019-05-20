import React, { Component } from 'react';
import styles from '../style/bjlPage.css';
import { connect } from 'dva';
class BjlPage extends Component {
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
            param.gameId = 10020;
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
            <div className={styles.bjlBox}>
                <div className={styles.bjlImg1} />
                <div className={styles.bjlImg2} />
                <div className={styles.bjlImg3} />
                <div className={styles.bjlIco1} />
                <div className={styles.bjlIco2} />
                <div className={styles.bjlIco3} />
                <div className={styles.bjlIco4} />
                <div className={styles.bjlIco5} />
                <div className={styles.bjlIco6} />
                <div className={styles.bjlIco7} />
                <div className={styles.bjlIco8} />
                <div className={styles.bjlBoxInfo} >
                    <div className={styles.title}>游戏起源</div>
                    <div className={styles.body}>早在远古时期的欧洲，百家乐已经初步雏形那时候叫做Baccarat，这是一种非常古老的游戏，几个世纪以来相继在各个大洲于国家之中兴起流行开来，规则不断的完善和改进，演变成现在的游戏规则。20世纪60年代，一位姓叶的先生将Baccarat从美国引进到中国，并给他起了一个响亮的名字“百家乐”。</div>
                </div>
                <div className={styles.bjlBoxButton} onClick={this.showGameIframe.bind(this, loginStatus)}>进入游戏</div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(BjlPage);