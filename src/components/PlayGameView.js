import { connect } from 'dva';
import { Modal } from 'antd';
import styles from 'style/playGameView.css';

class PlayGameView extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
    }

    hideplayGameView(playGameBoxTypeMenu) {
        this.props.dispatch({
            type: 'game/closePlayBox'
        });
        if (playGameBoxTypeMenu) {
            this.props.dispatch({
                type: 'game/changePlayGameBoxType',
                payload: false
            });
            this.props.dispatch({
                type: 'game/changeGameListStatus',
                payload: true
            });
        }
    }

    render() {
        const { playGameBox, gameHref, playGameBoxTypeMenu } = this.props;
        return (
            <Modal
                title={null}
                centered
                closable={true}
                maskClosable={false}
                width={'80vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={playGameBox}
                onCancel={() => this.hideplayGameView(playGameBoxTypeMenu)}
            >
                <div className={styles.playGameBox}>
                    <div className={styles.playGameBody}>
                        <div className={styles.playGameBodyBox}>
                            <iframe
                                width="100%"
                                height='100%'
                                src={gameHref}
                                scrolling="no"
                                frameBorder="0"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        playGameBox: state.game.playGameBox,
        gameHref: state.game.gameHref,
        playGameBoxTypeMenu: state.game.playGameBoxTypeMenu
    }
}

export default connect(mapStateToProps)(PlayGameView);