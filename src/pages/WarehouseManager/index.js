import classNames from 'classnames/bind';
import styles from './Warehouse.module.scss';
import WarehouseTable from '~/components/Warehouse/TableWarehoues';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function WarehouseManager() {
    const userPermissions = useSelector((state) => state.user.permissions);

    const canCreateOrderImport = userPermissions.includes('Quản lý kho - Tạo hóa đơn nhập');
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-title')}>
                <div className={cx('actions')}>
                    <h4 className={cx('title')}>Hóa đơn nhập hàng</h4>
                </div>
                {canCreateOrderImport && (
                    <div className={cx('actions')}>
                        <Link to={'/warehouse'}>
                            <Button type="primary">Tạo hóa đơn nhập</Button>
                        </Link>
                    </div>
                )}
            </div>
            <div className={cx('content')}>
                <WarehouseTable />
            </div>
        </div>
    );
}

export default WarehouseManager;
