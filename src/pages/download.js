import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import styles from '../style/download.css';
import { connect } from 'dva';
class download extends Component {
    constructor() {
        super();
        this.state = {
            type: 'wechat'
        }
    }

    componentDidMount() {
    }

    checkPlatForm() {
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
            var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
            if (ua.match(/MicroMessenger/i) === "micromessenger") {
                //在微信中打开
                return 'wechat';
            } else if (browser.versions.ios) {
                //是否在IOS浏览器打开
                return 'ios';
            } else if (browser.versions.android) {
                //是否在安卓浏览器打开
                return 'android';
            } else {
                return 'mobil';
            }
        } else {
            return 'pc';
        }

    }

    checkAndroid = () => {
        let platInfo = this.checkPlatForm();
        if (platInfo === 'android') {
            window.location.href = "/app/android_v1.apk";
            return;
        } else if (platInfo === 'ios') {
            Toast.fail('请选择IOS下载', 3, () => { }, true);
            return;
        } else if (platInfo === 'wechat') {
            Toast.fail('请点击右上角选择其它浏览器打开', 3, () => { }, true);
            return;
        } else {
            Toast.fail('请点击右上角选择其它浏览器打开', 3, () => { }, true);
            return;
        }
    }

    checkIos = () => {
        let platInfo = this.checkPlatForm();
        if (platInfo === 'ios') {
            Toast.success('暂无下载文件，请稍后再试', 3, () => { }, true)
            return;
        } else if (platInfo === 'android') {
            Toast.fail('请选择Android下载', 3, () => { }, true)
            return;
        } else if (platInfo === 'wechat') {
            Toast.fail('请点击右上角选择Safari打开', 3, () => { }, true)
            return;
        } else {
            Toast.fail('请点击右上角选择Safari打开', 3, () => { }, true)
            return;
        }
    }

    render() {
        return (
            <div className={styles.downloadBox}>
                <div className={styles.downAppBut}>
                    <div className={styles.downAppButAndroid} onClick={this.checkAndroid}></div>
                    <div className={styles.downAppButIos} onClick={this.checkIos}></div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
    }
}
export default connect(mapStateToProps)(download);