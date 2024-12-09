import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Table, Tag } from 'antd';
import { faEye, faLock, faSearch, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalDetailCustomer from '~/components/Modals/ModalDetailCustomer';
import styles from './CustomerManagement.module.scss';
import { fecthShowAllCustomerAPI, fetchCustomerByIdAPI } from '~/apis/Customer';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function CustomerManagement() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const userPermissions = useSelector((state) => state.user.permissions);

    const canBlockAccountCustomer = userPermissions.includes('Quản lý khách hàng - Khóa tài khoản khách hàng');
    const canViewDetailCustomer = userPermissions.includes(
        'Quản lý khách hàng - Xem danh sách đơn hàng của khách hàng',
    );

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fecthShowAllCustomerAPI();
                const formattedData = formatCustomerData(response);
                setCustomers(formattedData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu khách hàng:', error);
                message.error('Không thể tải dữ liệu khách hàng.');
            }
        };

        fetchCustomers();
    }, []);

    const handleViewDetail = async (record) => {
        try {
            // Gọi API để lấy chi tiết khách hàng theo id
            const customerDetail = await fetchCustomerByIdAPI(record.key);
            setSelectedCustomer(customerDetail);
            console.log('dữ liệu khách hàng theo id: ', customerDetail);
            setIsModalVisible(true);
        } catch (error) {
            console.log('dữ liệu khách hàng theo id: ', record);
            console.error('Lỗi khi lấy thông tin chi tiết khách hàng:', error);
            message.error('Không thể tải thông tin chi tiết khách hàng.');
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedCustomer(null);
    };

    const handleMenuClick = (e) => {
        message.info('Click on menu item.');
        console.log('click', e);
    };

    const items = [
        { label: '1st menu item', key: '1', icon: <UserOutlined /> },
        { label: '2nd menu item', key: '2', icon: <UserOutlined /> },
        { label: '3rd menu item', key: '3', icon: <UserOutlined />, danger: true },
        { label: '4rd menu item', key: '4', icon: <UserOutlined />, danger: true, disabled: true },
    ];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const formatCustomerData = (customers) => {
        return customers.map((customer) => {
            const statusText = customer.isDelete === 0 ? 'Bình thường' : 'Bị khóa'; // Dựa trên isDelete
            const tagColor = customer.isDelete === 0 ? 'green' : 'volcano'; // Màu sắc của tag

            return {
                key: customer.id,
                name: customer.FullName,
                email: customer.email,
                phone: customer.Phone,
                isDelete: customer.isDelete,
                statusText,
                tagColor,
            };
        });
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'statusText', // Dùng `statusText` thay vì `tags`
            render: (text, record) => <Tag color={record.tagColor}>{text.toUpperCase()}</Tag>,
        },
        {
            title: 'Tùy chọn',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {canViewDetailCustomer && (
                        <button className={cx('btn-viewDetail')} onClick={() => handleViewDetail(record)}>
                            <FontAwesomeIcon icon={faEye} /> Chi tiết
                        </button>
                    )}
                    {canBlockAccountCustomer && (
                        <button className={cx('btn-lock')}>
                            <FontAwesomeIcon icon={record.isDelete === 1 ? faUnlock : faLock} />
                            {record.isDelete === 1 ? ' Mở Khóa' : ' Khóa'}
                        </button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className={cx('wrapper', 'container-fill')}>
            <ModalDetailCustomer visible={isModalVisible} onClose={handleCloseModal} customerData={selectedCustomer} />

            <div className={cx('row', 'row-action')}>
                <div className={cx('col-md-7', 'form-search')}>
                    <form className={cx('search-input')}>
                        <input placeholder="Tìm kiếm khách hàng..." />
                        <FontAwesomeIcon className={cx('fa-search')} icon={faSearch} />
                    </form>
                </div>

                <div className={cx('col-md-5', 'filter-customer')}>
                    <div className={cx('filter-option')}>
                        <h6>Giới tính:</h6>
                        <Dropdown menu={menuProps}>
                            <Button>
                                <Space>
                                    Button
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                    <div className={cx('filter-option')}>
                        <h6>Trạng thái:</h6>
                        <Dropdown menu={menuProps}>
                            <Button>
                                <Space>
                                    Button
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className={cx('row')}>
                <Table columns={columns} dataSource={customers} />
            </div>
        </div>
    );
}

export default CustomerManagement;
