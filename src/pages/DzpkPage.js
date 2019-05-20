import React, { Component } from 'react';
import styles from '../style/dzpkPage.css';
import { connect } from 'dva';
class DzpkPage extends Component {
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
            param.gameId = 620;
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
            <div className={styles.dzpkBox}>
                 <div className={styles.dzpkImg1}/>
                 <div className={styles.dzpkImg2}/>
                 <div className={styles.dzpkImg3}/>
                <div className={styles.dzpkLight} />
                <div className={styles.dzpkBoxInfo}>
                    <div className={styles.title}>游戏起源</div>
                    <div className={styles.body}>海的彼岸，存在一个国度，那里刚结束战争，硝烟的气息还未消散，饥饿散播在人们之间。有天，这里出现了新领袖，在他努力下，人民变得富足、充裕。后来他到了个叫德克萨斯的地方，见当地人，虽然物质上得到满足，但娱乐生活依旧匮乏。这位领袖为了德州人的娱乐生活，便在这里发明了德州扑克，风靡一时。</div>
                </div>
                <div className={styles.dzpkBoxButton} onClick={this.showGameIframe.bind(this, loginStatus)}>进入游戏</div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loginStatus: state.login.loginStatus
    }
}

export default connect(mapStateToProps)(DzpkPage);