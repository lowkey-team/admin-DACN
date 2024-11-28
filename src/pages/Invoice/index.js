import classNames from 'classnames/bind';
import styles from './invoice.module.scss';
import DataGridProDemo from '~/components/invoice/DataGridProDemo';

const cx = classNames.bind(styles);

function Invoice() {
    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Hóa đơn bán hàng</h1>
            <div className={cx('content')}>
                <DataGridProDemo />
            </div>
        </div>
    );
}

export default Invoice;
