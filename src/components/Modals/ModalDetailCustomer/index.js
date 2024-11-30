import classNames from 'classnames/bind';
import { Modal, Select, Table, Button, Dropdown, message, Space, Tag } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { faEye, faLock, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './ModalDetailCustomer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { fetchAllOrderCustomer, fetchTotalOrderCustomer } from '~/apis/Customer';

const cx = classNames.bind(styles);
const { Option } = Select;

const columns = [
    {
        title: 'Mã Đơn',
        dataIndex: 'invoice_id',  // Dùng invoice_id từ dữ liệu
        key: 'invoice_id',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'finalAmount',  // Dùng finalAmount từ dữ liệu
        key: 'finalAmount',
    },
    {
        title: 'Ngày đặt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => new Date(text).toLocaleDateString(), // Chuyển đổi ngày
    },
    {
        title: 'Trạng thái',
        dataIndex: 'orderStatus',  // Dùng orderStatus từ dữ liệu
        key: 'orderStatus',
    },
    {
        title: 'Tùy chọn',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <button className={cx('btn-viewDetail')}>
                    <FontAwesomeIcon icon={faEye} /> Chi tiết
                </button>
            </Space>
        ),
    },
];


function ModalDetailCustomer({ visible, onClose, customerData }) {
    const [totalOrder, setTotalOrder] = useState(0);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (visible && customerData?.id) {
            const fetchData = async () => {
                try {
                    const data = await fetchTotalOrderCustomer(customerData.id);
                    setTotalOrder(data.totalOrder || 0);
                } catch (error) {
                    console.error('Lỗi lấy dữ liệu order:', error);
                }
            };
            fetchData();
        }
    }, [visible, customerData]);

    useEffect(() => {
        if (visible && customerData?.id) {
            const fetchData = async () => {
                try {
                    const data = await fetchAllOrderCustomer(customerData.id); // Lấy danh sách đơn hàng
                    setOrders(data || []);
                } catch (error) {
                    console.error('Lỗi lấy dữ liệu đơn hàng:', error);
                }
            };
            fetchData();
        }
    }, [visible, customerData]);

    if (!customerData) return null;

    return (
        <Modal visible={visible} centered onCancel={onClose} footer={null} width={1000}>
            <div className={cx('content-modal')}>
                <div className={cx('title')}>
                    <h4>Thông tin khách hàng</h4>
                </div>
                <hr />
                <div className={cx('content')}>
                    <div className={cx('main-info')}>
                        <div className={cx('user-name')}>
                            <span>{customerData.FullName}</span>
                        </div>
                        <div className={cx('status')}>
                            Trạng thái: <span>{customerData.isDelete === 0 ? 'Bình Thường' : 'Bị Khóa'}</span>
                        </div>
                        <div className={cx('date')}>
                            Địa chỉ: <span>{customerData.address}</span>
                        </div>
                    </div>
                    <div className={cx('detail-info')}>
                        <div className={cx('user-code')}>
                            Mã khách hàng: <span>{customerData.id}</span>
                        </div>
                        <div className={cx('date')}>
                            Ngày tạo: <span>{new Date(customerData.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className={cx('service-used')}>
                        Tổng số đơn hàng đã mua: <span>{totalOrder}</span>
                    </div>
                </div>

                <div className={cx('table-order')}>
                    <Table
                        dataSource={orders}
                        columns={columns}
                        pagination={false}
                        scroll={{ y: 250, x: '100%' }}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default ModalDetailCustomer;
