import React, { Component } from 'react';
import styles from '../style/index.css';
import router from 'umi/router';
import { Icon } from 'antd';
import { connect } from 'dva';
import HomePage from './HomePage';
import HallPage from './HallPage';
import DzpkPage from './DzpkPage';
import EbgPage from './EbgPage';
import ZjhPage from './ZjhPage';
import QznnPage from './QznnPage';
import BjlPage from './BjlPage';
import BrnnPage from './BrnnPage';
import MoreGame from './MoreGame';
import RightMenuView from '../components/RightMenuView';
import GameMenuPage from './GameMenuPage';
import ico1 from '../assets/ico_1.png';
import ico2 from '../assets/ico_2.png';
import ico3 from '../assets/ico_3.png';
import ico4 from '../assets/ico_4.png';
import ico5 from '../assets/ico_5.png';
import ico6 from '../assets/ico_6.png';
import ico7 from '../assets/ico_7.png';
import ico8 from '../assets/ico_8.png';
import ico9 from '../assets/ico_9.png';
import icoMenu from '../assets/ico_menu.png';
import icoUser from '../assets/ico_user.png';
import LoginView from '../components/LoginView';
import RegisterView from '../components/RegisterView';
import RegisterRuleView from '../components/RegisterRuleView';
import RechargeRecordView from '../components/RechargeRecordView';
import RechargeView from '../components/RechargeView';
import PlayGameView from '../components/PlayGameView';
import AgencyRelationshipView from '../components/AgencyRelationshipView';
import AgencyTransferRecordView from '../components/AgencyTransferRecordView';
import AgencyTransferView from '../components/AgencyTransferView';
import MyMessageView from '../components/MyMessageView';
import SendMessageView from '../components/SendMessageView';
import MemberInfoView from '../components/MemberInfoView';
import MessageInfoView from '../components/MessageInfoView';
import BankCardView from '../components/BankCardView';
import LoginPassView from '../components/LoginPasswordView';
import FundPassView from '../components/FundPasswordView';
import GameRecordView from '../components/GameRecordView';
import TransferRecordView from '../components/TransferRecordView';
import GoldTransferView from '../components/GoldTransferView';
import CashWithdrawalView from '../components/CashWithdrawalView';
import WithdrawalsRecordView from '../components/WithdrawalsRecordView';
import HistoryGainsView from '../components/HistoryGainsView';
import AgencyRuleView from '../components/AgencyRuleView';
import AddingBankCardsView from '../components/AddingBankCardsView';
import InitiationView from '../components/InitiationView';
import UserInfoView from '../components/UserInfoView';


class index extends Component {
  constructor() {
    super();

    this.state = {
      menuBoxStatus: true,
      offsetheight: document.documentElement.clientHeight,    //获取当前页面的高度
      icoListHeight: document.documentElement.clientHeight / 100 * 4,
      fullPage: 0,           //当前在第几页
      fullPageNum: false,        //是否在滑动
      supportsPassive: false,
      isfireFox: false
    }
  }

  componentDidMount() {
    var browser = {
      versions: function () {
        var u = navigator.userAgent;
        return {         //移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
          iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
        };
      }(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
      router.push('/Download');
    }

    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true;
        }
      });
      window.addEventListener("test", null, opts);
    } catch (e) { }

    //移除鼠标滑动事件
    if (document.addEventListener) {
      document.addEventListener('DOMMouseScroll', this.scroll.bind(this), supportsPassive ? { passive: true } : false);
    }
    window.onmousewheel = document.onmousewheel = this.scroll.bind(this);//IE/Opera/Chrome/Safari

    //监听窗口大小改变
    window.addEventListener('resize', this.handleResize.bind(this), supportsPassive ? { passive: true } : false)

  }

  componentWillUnmount() { //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('resize', this.handleResize.bind(this), false)
  }

  handleResize = (e) => {
    let clientHeight = document.documentElement.clientHeight;
    let perHeight = document.documentElement.clientHeight / 100;
    if (this.state.fullPage === 0) {
      this.setState({
        icoListHeight: perHeight * 4,
        offsetheight: clientHeight
      })
    } else {
      this.setState({
        icoListHeight: clientHeight - (perHeight * 12),
        offsetheight: clientHeight
      })
    }
  };

  pageInfo(index) {
    let clientHeight = document.documentElement.clientHeight;
    let perHeight = document.documentElement.clientHeight / 100;
    if (index === 0) {
      this.setState({
        fullPage: index,
        icoListHeight: perHeight * 4
      })
    } else {
      this.setState({
        fullPage: index,
        icoListHeight: clientHeight - (12 * perHeight)
      })
    }
  }

  scroll(e) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    //是否正在滑动
    if (this.state.fullPageNum) {
      return false;
    }
    let eValue = 0;
    if (e.wheelDelta) {//IE/Opera/Chrome
      eValue = e.wheelDelta;
    } else if (e.detail) {//Firefox
      eValue = e.detail;
    }

    //   eValue为负数时向下滑动
    if (eValue <= 0) {
      if (this.state.fullPage >= 8) {
        return false
      }
      this.setState({ fullPageNum: true })
      this.pageInfo(this.state.fullPage + 1);
      //  css设置动画事件为1000，所以等到1000ms后滚动状态为false
      setTimeout(() => {
        this.setState({ fullPageNum: false })
      }, 1000)
      //   否则就是向上划
    } else {
      if (this.state.fullPage <= 0) {
        return false;
      }
      this.setState({ fullPageNum: true });
      this.pageInfo(this.state.fullPage - 1);
      setTimeout(() => {
        this.setState({ fullPageNum: false })
      }, 1000)
    }
  }

  showMenu = (status, loginStatus) => {
    if (loginStatus) {
      this.props.dispatch({
        type: 'common/changeMenuStatus',
        payload: status
      });
    } else {
      this.props.dispatch({
        type: 'login/changeLoginBox',
        payload: true
      });
    }
  };

  showGameList = (status, loginStatus) => {
    if (loginStatus) {
      this.props.dispatch({
        type: 'game/changeGameListStatus', payload: status
      });
    } else {
      this.props.dispatch({
        type: 'login/changeLoginBox',
        payload: true
      });
    }
  };

  showUserInfo = (status, loginStatus) => {
    if (loginStatus) {
      this.props.dispatch({
        type: 'userinfo/changeUserInfoBox',
        payload: status
      });
    } else {
      this.props.dispatch({
        type: 'login/changeLoginBox',
        payload: true
      });
    }
  };

  renderModelView(userInfoBox, loginBox, registerBox, registerRuleBox, playGameBox,
    fastRechargeBox, rechargeRecordBox,
    agencyTransferRecordBox, agencyTransferBox, agencyRelationshipBox, historyGainsBox, agencyRuleBox,
    myMessageBox, sendMessageBox, messageInfoBox, memberRecordBox,
    bankCardBox, addBankCardBox,
    loginPassBox, fundPassBox,
    gameRecordBox,
    transferRecordBox, goldTransferBox,
    withdrawalsRecordBox, cashWithdrawalBox, withdrawSureInfoBox
  ) {
    if (loginBox) {
      console.log('aaaaaaaaaaaaaaaaaaaa');
      //移除鼠标滑动事件
      if (document.addEventListener) {
        document.removeEventListener('DOMMouseScroll', this.scroll.bind(this), false);
      }
      window.onmousewheel = document.onmousewheel = null;//IE/Opera/Chrome/Safari
      return (<LoginView />);
    } else if (userInfoBox) {
      return (<UserInfoView />);
    } else if (registerBox) {
      return (<RegisterView />);
    } else if (registerRuleBox) {
      return (<RegisterRuleView />);
    } else if (rechargeRecordBox) {
      return (<RechargeRecordView />);
    } else if (fastRechargeBox) {
      return (<RechargeView />);
    } else if (playGameBox) {
      return (<PlayGameView />);
    } else if (agencyRelationshipBox) {
      return (<AgencyRelationshipView />);
    } else if (agencyTransferBox) {
      return (<AgencyTransferView />);
    } else if (agencyTransferRecordBox) {
      return (<AgencyTransferRecordView />);
    } else if (historyGainsBox) {
      return (<HistoryGainsView />);
    } else if (agencyRuleBox) {
      return (<AgencyRuleView />);
    } else if (myMessageBox) {
      return (<MyMessageView />);
    } else if (sendMessageBox) {
      return (<SendMessageView />);
    } else if (memberRecordBox) {
      return (<MemberInfoView />);
    } else if (messageInfoBox) {
      return (<MessageInfoView />);
    } else if (bankCardBox) {
      return (<BankCardView />);
    } else if (addBankCardBox) {
      return (<AddingBankCardsView />);
    } else if (loginPassBox) {
      return (<LoginPassView />);
    } else if (fundPassBox) {
      return (<FundPassView />);
    } else if (gameRecordBox) {
      return (<GameRecordView />);
    } else if (transferRecordBox) {
      return (<TransferRecordView />);
    } else if (goldTransferBox) {
      return (<GoldTransferView />);
    } else if (withdrawalsRecordBox) {
      return (<WithdrawalsRecordView />);
    } else if (cashWithdrawalBox) {
      return (<CashWithdrawalView />);
    } else if (withdrawSureInfoBox) {
      return (<InitiationView />);
    } else {
      return null;
    }
  }

  onShowBackTop() {
    if (this.state.fullPage > 0) {
      return (<div className={styles.backTopIcoBox} onClick={this.pageInfo.bind(this, 0)}><Icon type="up-square" /></div>)
    } else {
      return null;
    }
  }

  render() {
    const {
      menuStatus, gameListStatus,
      loginStatus, userInfoBox, loginBox, registerBox, registerRuleBox, playGameBox,
      rechargeRecordBox, fastRechargeBox,
      agencyTransferRecordBox, agencyTransferBox, agencyRelationshipBox, historyGainsBox, agencyRuleBox,
      myMessageBox, sendMessageBox, messageInfoBox, memberRecordBox,
      bankCardBox, addBankCardBox,
      loginPassBox, fundPassBox,
      gameRecordBox,
      transferRecordBox, goldTransferBox,
      withdrawalsRecordBox, cashWithdrawalBox, withdrawSureInfoBox
    } = this.props;
    return (
      <div className={styles.section} style={{ 'height': this.state.offsetheight + 'px' }}>
        {this.onShowBackTop()}
        {this.renderModelView(
          userInfoBox, loginBox, registerBox, registerRuleBox, playGameBox,
          fastRechargeBox, rechargeRecordBox,
          agencyTransferRecordBox, agencyTransferBox, agencyRelationshipBox, historyGainsBox, agencyRuleBox,
          myMessageBox, sendMessageBox, messageInfoBox, memberRecordBox,
          bankCardBox, addBankCardBox,
          loginPassBox, fundPassBox,
          gameRecordBox,
          transferRecordBox, goldTransferBox,
          withdrawalsRecordBox, cashWithdrawalBox, withdrawSureInfoBox
        )}

        <RightMenuView />
        <GameMenuPage />
        <div className={styles.container} style={{ 'transform': 'translate3d(0px,-' + this.state.fullPage * this.state.offsetheight + 'px, 0px)' }}>
          <div className={styles.homePageBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <HomePage onClickNextPage={this.pageInfo.bind(this, this.state.fullPage + 1)} />
          </div>
          <div className={styles.hallBg} id="sow" style={{ 'height': this.state.offsetheight + 'px' }}>
            <HallPage />
          </div>
          <div className={styles.dzpkBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <DzpkPage />
          </div>
          <div className={styles.ebgBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <EbgPage />
          </div>
          <div className={styles.zjhBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <ZjhPage />
          </div>
          <div className={styles.qznnBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <QznnPage />
          </div>
          <div className={styles.bjlBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <BjlPage />
          </div>
          <div className={styles.brnnBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <BrnnPage />
          </div>
          <div className={styles.gdyxBg} style={{ 'height': this.state.offsetheight + 'px' }}>
            <MoreGame />
          </div>
        </div>
        <div className={styles.copyRight}>
          copyRight
        </div>
        <div className={styles.icoList} style={{ 'transform': 'translate3d(0px,-' + this.state.icoListHeight + 'px, 0px)' }}>
          <span onClick={this.showUserInfo.bind(this, !userInfoBox, loginStatus)}  ><img src={icoUser} /></span>
          <span className={this.state.fullPage === 1 ? styles.hover : null} onClick={this.pageInfo.bind(this, 1)}><img src={ico1} /></span>
          <span className={this.state.fullPage === 2 ? styles.hover : null} onClick={this.pageInfo.bind(this, 2)}><img src={ico2} /></span>
          <span className={this.state.fullPage === 3 ? styles.hover : null} onClick={this.pageInfo.bind(this, 3)}><img src={ico3} /></span>
          <span className={this.state.fullPage === 4 ? styles.hover : null} onClick={this.pageInfo.bind(this, 4)}><img src={ico4} /></span>
          <span onClick={this.showGameList.bind(this, !gameListStatus, loginStatus)} ><img src={ico5} /></span>
          <span className={this.state.fullPage === 5 ? styles.hover : null} onClick={this.pageInfo.bind(this, 5)}><img src={ico6} /></span>
          <span className={this.state.fullPage === 6 ? styles.hover : null} onClick={this.pageInfo.bind(this, 6)}><img src={ico7} /></span>
          <span className={this.state.fullPage === 7 ? styles.hover : null} onClick={this.pageInfo.bind(this, 7)}><img src={ico8} /></span>
          <span className={this.state.fullPage === 8 ? styles.hover : null} onClick={this.pageInfo.bind(this, 8)}><img src={ico9} /></span>
          <span onClick={this.showMenu.bind(this, !menuStatus, loginStatus)} ><img src={icoMenu} /></span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    playGameBox: state.game.playGameBox,
    loginBox: state.login.loginBox,
    registerBox: state.login.registerBox,
    registerRuleBox: state.login.registerRuleBox,
    menuStatus: state.common.menuStatus,
    gameListStatus: state.game.gameListStatus,
    loginStatus: state.login.loginStatus,
    userInfoBox: state.userinfo.userInfoBox,

    rechargeRecordBox: state.recharge.rechargeRecordBox,
    fastRechargeBox: state.recharge.fastRechargeBox,

    agencyTransferRecordBox: state.agency.agencyTransferRecordBox,
    agencyTransferBox: state.agency.agencyTransferBox,
    agencyRelationshipBox: state.agency.agencyRelationshipBox,
    historyGainsBox: state.agency.historyGainsBox,
    agencyRuleBox: state.agency.agencyRuleBox,


    myMessageBox: state.message.myMessageBox,
    sendMessageBox: state.message.sendMessageBox,
    memberRecordBox: state.message.memberRecordBox,
    messageInfoBox: state.message.messageInfoBox,

    bankCardBox: state.bankCard.bankCardBox,
    addBankCardBox: state.bankCard.addBankCardBox,

    loginPassBox: state.user.loginPassBox,
    fundPassBox: state.user.fundPassBox,

    gameRecordBox: state.gameRecord.gameRecordBox,

    transferRecordBox: state.gold.transferRecordBox,
    goldTransferBox: state.gold.goldTransferBox,

    withdrawalsRecordBox: state.withdrawals.withdrawalsRecordBox,
    cashWithdrawalBox: state.withdrawals.cashWithdrawalBox,
    withdrawSureInfoBox: state.withdrawals.withdrawSureInfoBox,

  }
}

export default connect(mapStateToProps)(index);
