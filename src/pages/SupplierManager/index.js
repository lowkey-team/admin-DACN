import classNames from 'classnames/bind';
import styles from './SupplierManager.module.scss';
import SupplierTable from '~/components/Supplier/SupplierTable';
import { useState } from 'react';
import ModalAddNewSupplier from '~/components/Supplier/ModalAddNewSupplier';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function Supplier() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const userPermissions = useSelector((state) => state.user.permissions);

    const canAddSupplier = userPermissions.includes('Quản lý nhà cung cấp - Thêm nhà cung cấp mới');

    // Handle modal visibility
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddSupplier = (values) => {
        console.log('New Supplier Added:', values);
        // You can perform API call here to add the supplier
        setIsModalVisible(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h4>Danh sách nhà cung cấp</h4>
                {canAddSupplier && (
                    <button className={cx('btn-addNew')} onClick={showModal}>
                        + Thêm nhà cung cấp mới
                    </button>
                )}

                <ModalAddNewSupplier
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onAddSupplier={handleAddSupplier}
                />
            </div>

            <div className={cx('content')}>
                <SupplierTable />
            </div>
        </div>
    );
}

export default Supplier;
