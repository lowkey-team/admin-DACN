import classNames from "classnames/bind";
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Table, Tag } from 'antd';
import { faEye, faLock, faSearch, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalDetailCustomer from "~/components/Modals/ModalDetailCustomer";
import styles from './CustomerManagement.module.scss'

const cx = classNames.bind(styles);

function CustomerManagement() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleViewDetail = (record) => {
        setSelectedCustomer(record); 
        setIsModalVisible(true); 
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
    {
        label: '1st menu item',
        key: '1',
        icon: <UserOutlined />,
    },
    {
        label: '2nd menu item',
        key: '2',
        icon: <UserOutlined />,
    },
    {
        label: '3rd menu item',
        key: '3',
        icon: <UserOutlined />,
        danger: true,
    },
    {
        label: '4rd menu item',
        key: '4',
        icon: <UserOutlined />,
        danger: true,
        disabled: true,
    },
    ];
    const menuProps = {
    items,
    onClick: handleMenuClick,
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
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Điện thoại',
            dataIndex: 'phone',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
          title: 'Tạo ngày',
          dataIndex: 'CreateAt',
          key: 'age',
        },
        {
          title: 'Địa chỉ',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: 'Trạng thái',
          key: 'tags',
          dataIndex: 'tags',
          render: (_, { tags }) => (
            <>
              {tags.map((tag) => {
                let color = tag.text === 'Bình thường' ? 'geekblue' : 'green';
                if (tag === 'Bị khóa') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Tùy chọn',
          key: 'action',
          render: (_, record) => (
            <>
                <Space size="middle">
                  <button className={cx('btn-viewDetail')}  onClick={() => handleViewDetail(record)}>
                    <FontAwesomeIcon icon={faEye}/> Chi tiết
                </button>
                <button className={cx('btn-lock')}>
                    <FontAwesomeIcon icon={record.tags.includes("Bị khóa") ? faUnlock : faLock} />
                    {record.tags.includes("Bị khóa") ? " Mở Khóa" : " Khóa"}   
                    
                </button>
                </Space>
    
               
            </>
          ),
        },
      ];
      const data = [
        {
          key: '1',
          name: 'Xuân Bính',
          email: 'xuanbinh@gmail.com',
          phone: '0123456789',
          CreateAt: '26/11/2024',
          address: '140 Lê Trọng Tấn, P. Tây Thạnh, Q. Tân Phú, TP. Hồ Chí Minh',
          tags: ['Bình thường'],
        },
        {
          key: '2',
          name: 'Bính nè',
          email: 'binhne@gmail.com',
          phone: '0123456789',
          CreateAt: '26/11/2024',
          address: '123 Trường Trinh',
          tags: ['Bị khóa'],
        },
        {
          key: '3',
          name: 'Bính Nguyễn',
          email: 'binhnguyen@gmail.com',
          phone: '0123456789',
          CreateAt: '26/11/2024',
          address: '456 Cộng Hòa',
          tags: ['Bình thường'],
        },
      ];

    return ( 
        <div className={cx('wrapper', 'container-fill')}>
             <ModalDetailCustomer
                     visible={isModalVisible}
                     onClose={handleCloseModal}
                     customerData={selectedCustomer}
                />
            <div className={cx('row', 'row-action')}>
                <div className={cx('col-md-7', 'form-search')}>
                    <form className={cx('search-input')}>
                        <input 
                            placeholder="Tìm kiếm khách hàng..."
                        />
                        <FontAwesomeIcon className={cx('fa-search')} icon={faSearch}/>
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
            <Table columns={columns} dataSource={data} />
            </div>  
        </div>  
     );
}

export default CustomerManagement;