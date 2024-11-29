import classNames from 'classnames/bind';
import styles from './Warehouse.module.scss';
import WarehouseTable from '~/components/Warehouse/TableWarehoues';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function WarehouseManager() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-title')}>
                <div className={cx('actions')}>
                    <h4 className={cx('title')}>Hóa đơn nhập hàng</h4>
                </div>
                <div className={cx('actions')}>
                    <Link to={'/warehouse'}>
                        <Button type="primary">Tạo hóa đơn nhập</Button>
                    </Link>
                </div>
            </div>
            <div className={cx('content')}>
                <WarehouseTable />
            </div>
        </div>
    );
}

export default WarehouseManager;
