import { connect } from 'dva';
import { Modal, Spin, Input, Form} from 'antd';
import styles from '../style/loginView.css';


const { TextArea } = Input;
class SendMessageForm extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
    }

    hideSendMessageBox() {
        this.props.dispatch({
            type: 'message/changeSendMessageBox',
            payload: false
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'message/toSendMessage',
                    payload: values,
                    callback: (res) => {
                        if (res.errorCode && res.errorCode !== 1) {
                            this.props.form.setFields({
                                content: {
                                    value: values.content,
                                    errors: [new Error(res.errorMsg || '未知错误')],
                                },
                            });
                        } else {
                            this.props.dispatch({
                                type: 'message/changeSendMessageBox',
                                payload: false
                            }); 

                            let obj = {};
                            obj.userId = null;
                            obj.account = null;
                            this.props.dispatch({
                                type: 'message/changeMessageReciveUserInfo',
                                payload: obj
                            }); 
                            this.props.dispatch({
                                type: 'message/changeMessageType',
                                payload: 2
                            });
                            this.props.dispatch({
                                type: 'message/changeMyMessageBox',
                                payload: true
                            });
                        }
                    }
                });
            }
        })
    }

    render() {
        const { sendMessageBox, messageUserId, messageUserAccount, form, loading } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                title={null}
                centered
                closable={false}
                width={'30vw'}
                bodyStyle={{ padding: 0 }}
                footer={null}
                visible={sendMessageBox}
                onCancel={() => this.hideSendMessageBox()}
            >
                <Spin spinning={loading} size="large" tip="正在处理中" delay={500} >
                    <Form>
                        <div className={styles.loginBox}>
                            <div className={styles.loginBody}>
                                <div className={styles.loginBodyBox}>
                                    <div className={styles.loginBodyBoxTitle}>发送消息</div>
                                    <div className={styles.loginBodyBoxBody}>
                                        <Form.Item className={styles.loginBodyBoxBodyItem} style={{ display:'none'}}>
                                            {getFieldDecorator('receive_id', {
                                                rules: [{ required: true, message: '请输入下级用户名' }],
                                                initialValue: messageUserId
                                            })(
                                                <Input placeholder="请输入下级用户名" autoComplete="off"  disabled={true} onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem} extra={"注：仅限直属下级"}>
                                            {getFieldDecorator('receive_name', {
                                                rules: [{ required: true, message: '请输入下级用户名' }],
                                                initialValue: messageUserAccount
                                            })(
                                                <Input placeholder="请输入下级用户名" autoComplete="off" disabled={true} onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('title', {
                                                rules: [
                                                    { required: true, message: '请输入标题，20个字以内' },
                                                    { pattern: /^[\s\S]{1,19}$/, message: '标题应为20个字以内' }
                                                ],
                                            })(
                                                <Input placeholder="请输入标题，20个字以内" autoComplete="off" onPressEnter={this.handleSubmit} />
                                            )}
                                        </Form.Item>
                                        <Form.Item className={styles.loginBodyBoxBodyItem}>
                                            {getFieldDecorator('content', {
                                                rules: [
                                                    { required: true, message: '请输入消息内容，200字以内' },
                                                    { pattern: /^[\s\S]{1,199}$/, message: '消息内容应为200个字以内' }
                                                ],
                                            })(
                                                <TextArea rows={8} placeholder="请输入消息内容，200字以内" autoComplete="off" onPressEnter={this.handleSubmit}></TextArea>
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className={styles.loginBodyBoxButton}>
                                        <span onClick={this.handleSubmit} className={styles.loginButton}>确定发送</span>
                                        <span className={styles.registerButton} onClick={() => this.hideSendMessageBox()}>取消</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}
const SendMessageView = Form.create({ name: 'SendMessageView' })(SendMessageForm);
function mapStateToProps(state) {
    return {
        sendMessageBox: state.message.sendMessageBox,
        messageUserId: state.message.messageUserId,
        messageUserAccount: state.message.messageUserAccount,
        loading: state.loading.effects['message/toSendMessage'] || false
    }
}

export default connect(mapStateToProps)(SendMessageView);