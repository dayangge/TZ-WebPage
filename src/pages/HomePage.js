import React, { Component } from 'react';
import styles from 'style/homePage.css';
import { connect } from 'dva';
import homeNextIco from 'assets/home_next_ico.png';

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            homeList: [],
            homeCodeList: [],
            
        }
    }

    componentDidMount = () => {

            this.onGetHomeList();
        this.onGetHomeCodeList();
    }
    onGetHomeList() {
        this.props.dispatch({
            type: 'game/getGameHomeList',
            payload: false,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {

                } else {
                    this.setState({
                        homeList: res.list,
                    });
                    
                }
            }
        });
    }
    onGetHomeCodeList() {
        this.props.dispatch({
            type: 'game/getGameHomeCodeList',
            payload: false,
            callback: (res) => {
                if (res.errorCode && res.errorCode !== 1) {
                } else {
                    this.setState({
                        homeCodeList: res,
                    });
                }
            }
        });
    }
    homeInfoItem() {
        if (this.state.homeCodeList.length > 0) {
            let homeCodeList = this.state.homeCodeList;
            let views = [];
            for (let i = 0; i < homeCodeList.length; i++) {
                let listItem = homeCodeList[i];
                if (listItem.en_name === "index_left_img") {
                    views.push(
                        // gamlistItem要传的参数
                        <div key={i} className={styles.homeItemImg} style={{ position: 'absolute', right: '36vw', bottom: '15vw' }}>
                            <a href={listItem.extend_param} target="_blank">
                                <img className={styles.homeItemImgContent} src={listItem.content} style={{border:'0.3vw solid #fff'}} alt={listItem} />
                            </a>
                        </div>
                    );
                } else if (listItem.en_name === "index_right_img") {
                    views.push(
                        // gamlistItem要传的参数
                        <div key={i} className={styles.homeItemImg} style={{ position: 'absolute', left: '36vw', bottom: '15vw' }}>
                            <a href={listItem.extend_param} target="_blank">
                                <img className={styles.homeItemImgContent} src={listItem.content} style={{border:'0.3vw solid #fff'}} alt={listItem} />
                            </a>
                        </div>
                    );
                }
            }
            return views;
        } else {
            return null;
        }
    }
    homeInfoList() {
        if (this.state.homeList.length > 0) {
            let homeList = this.state.homeList;
            let views = [];
            for (let i = 0; i < homeList.length; i++) {
                const item = homeList[i];
                views.push(<span key={i}>{item.title}：{item.content}</span>)
            }
            return views;
        }else {
            return null;
        }
    }


    onLogin = (loginStatus) => {
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
            <div className={styles.homeBox}>
                <div className={styles.homeImg1} />
                <div className={styles.homeImg2} />
                <div className={styles.homeIco1} />
                <div className={styles.homeIco2} />
                <div className={styles.homeIco3} />
                <div className={styles.homeIco4} />
                <div className={styles.homeIco5} />
                <div className={styles.homeIco6} />
                <div className={styles.homeInfo}>
                    <p>欢迎来到 <span>天子棋牌</span></p>
                    <p>天子棋牌！无尽创意！天子，引领娱乐生活！！！</p>
                    <p>打开游戏之窗，放飞快乐时光。</p>
                    {/* <p>奔驰宝马 体验速度与激情</p> */}
                    {/* <p>德州扑克 秒开局 看看谁更牛...</p> */}
                </div>
                {loginStatus ?
                    <div className={styles.homeButton} onClick={this.onLogin.bind(this, loginStatus)}>进入游戏大厅</div>
                    :
                    <div className={styles.homeButton} onClick={this.onLogin.bind(this, loginStatus)}>注册或登录</div>
                }
                <div className={styles.homeNextButton} onClick={this.props.onClickNextPage}><img src={homeNextIco} /></div>
                <div className={styles.notice}>
                    <div className={styles.homeIco7}>
                        {this.homeInfoList()}
                    </div>
                </div>
                <div className={styles.homeListImg}>
                    {this.homeInfoItem()}
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

export default connect(mapStateToProps)(HomePage);