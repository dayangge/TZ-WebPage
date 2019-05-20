import { connect } from 'dva';
import { Spin, Empty } from 'antd';
import styles from '../style/gameMenuPage.css';
import dzpkImg from '../assets/ico_2.png';
import ebgImg from '../assets/ico_3.png';
import lhdImg from '../assets/ico_10.png';
import zjhImg from '../assets/ico_4.png';
import qznnImg from '../assets/ico_6.png';
import brnnImg from '../assets/ico_8.png';
import bcbmImg from '../assets/ico_11.png';
import bjlImg from '../assets/ico_7.png';
import ddzImg from '../assets/ico_12.png';

class GameMenuPage extends React.Component {
    constructor() {
        super();
        this.state = {
            pageNum: 1,
            pageSize: 12
        }
    }

    componentDidMount() {
        // let params = {};
        // params.pageSize = this.state.pageSize;
        // params.pageNum = this.state.pageNum;
        // this.props.dispatch({
        //     type: 'game/getGameList',
        //     payload: params
        // });
    }

    showGameList = (status) => {
        this.props.dispatch({
            type: 'game/changeGameListStatus',
            payload: status
        });
    }

    showGameIframe = (gameId) => {
        this.props.dispatch({
            type: 'game/changeGameListStatus',
            payload: false
        });
        this.props.dispatch({
            type: 'game/changePlayGameBoxType',
            payload: true
        });
        let param = {};
        param.gameId = gameId;
        this.props.dispatch({
            type: 'game/getGameUrl',
            payload: param
        });
    }

    // renderGameList(gameList) {
    //     if (gameList.length > 0) {
    //         let views = [];
    //         for (let i = 0; i < gameList.length; i++) {
    //             const item = gameList[i];
    //             views.push(<span key={i} onClick={this.showGameIframe.bind(this, item.id)} className={styles.gameListBoxLi}><img src={item.game_img} /></span>);
    //         }
    //         return views;
    //     } else {
    //         return <div className={styles.gameMenuEmpty}><Empty description={<span style={{ color: '#FFF' }}>暂无数据</span>} /></div>;
    //     }
    // }

    // renderGamePage(gameCount) {
    //     if (gameCount > 0) {
    //         return null;
    //     } else {
    //         return null;
    //     }
    // }

    render() {
        const { gameListStatus, loading, gameList, gameCount } = this.props;
        return (
            <div className={[styles.gameMenuBox, gameListStatus && styles.gameMenuBoxFlex].join(' ')}>
                <div className={styles.gameListButton} onClick={this.showGameList.bind(this, !gameListStatus)}></div>
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <div className={styles.gameListBox}>
                        {/* {this.renderGameList(gameList)}
                        {this.renderGamePage(gameCount)} */}
                        <span onClick={this.showGameIframe.bind(this, 620)} className={styles.gameListBoxLi}><img src={dzpkImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 720)} className={styles.gameListBoxLi}><img src={ebgImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 10025)} className={styles.gameListBoxLi}><img src={lhdImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 10205)} className={styles.gameListBoxLi}><img src={zjhImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 830)} className={styles.gameListBoxLi}><img src={qznnImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 10015)} className={styles.gameListBoxLi}><img src={brnnImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 10020)} className={styles.gameListBoxLi}><img src={bjlImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 10010)} className={styles.gameListBoxLi}><img src={bcbmImg} /></span>
                        <span onClick={this.showGameIframe.bind(this, 10005)} className={styles.gameListBoxLi}><img src={ddzImg} /></span>
                    </div>
                </Spin>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameListStatus: state.game.gameListStatus,
        loading: state.loading.effects['game/getGameList'] || false,
        gameList: state.game.gameList,
        gameCount: state.game.gameCount
    }
}

export default connect(mapStateToProps)(GameMenuPage);