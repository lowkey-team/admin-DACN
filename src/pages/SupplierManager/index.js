import classNames from 'classnames/bind';
import styles from './SupplierManager.module.scss';
import SupplierTable from '~/components/Supplier/SupplierTable';

const cx = classNames.bind(styles);

function Supplier() {
    return (
        <div className={cx('wrapper')}>
            <h4 className={cx('title')}>Danh sách nhà cung cấp</h4>
            <div className={cx('content')}>
                <SupplierTable />
            </div>
        </div>
    );
}

export default Supplier;
