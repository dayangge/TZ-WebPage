import { Button } from 'antd';
import styles from 'style/PaginationView.css';
class PaginationView extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
    }

    render() {
        if (this.props.Total === 0 || this.props.Total < this.props.pageSize) {
            return null;
        } else if (this.props.Total > this.props.pageSize * this.props.pageNum && this.props.pageNum === 1) {
            return (
                <div className={styles.paginationBox}>
                    <Button className={styles.paginationBoxButton} style={{background:'#FFF', color:'#d9d9d9'}} disabled={true}>上一页</Button>
                    <Button className={styles.paginationBoxButton} onClick={this.props.onNextPage}>下一页</Button>
                </div>
            )
        } else if (this.props.Total === this.props.pageSize * this.props.pageNum || Math.ceil(this.props.Total / this.props.pageSize) === this.props.pageNum) {
            return (
                <div className={styles.paginationBox}>
                    <Button className={styles.paginationBoxButton} onClick={this.props.onPrePage}>上一页</Button>
                    <Button className={styles.paginationBoxButton} style={{background:'#FFF', color:'#d9d9d9'}} disabled={true}>下一页</Button>
                </div>
            )
        } else {
            return (
                <div className={styles.paginationBox}>
                    <Button className={styles.paginationBoxButton} onClick={this.props.onPrePage}>上一页</Button>
                    <Button className={styles.paginationBoxButton} onClick={this.props.onNextPage}>下一页</Button>
                </div>
            )
        }
    }
}

export default PaginationView;