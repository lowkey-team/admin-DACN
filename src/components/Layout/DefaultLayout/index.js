import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ShoppingCartOutlined,
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    PieChartOutlined,
    FileTextOutlined,
    CustomerServiceOutlined,
    LogoutOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, message } from 'antd';
import classNames from 'classnames/bind';
import style from './Layout.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const cx = classNames.bind(style);
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const colorOptions = [
    { name: '#113536', value: '#113536' },
    { name: '#551c3b', value: '#551c3b' },
    { name: '#3e2069', value: '#3e2069' },
    { name: '#13a8a8', value: '#13a8a8' },
    { name: '#0B698B', value: '#0B698B' },
    { name: '#9CD3D8', value: '#9CD3D8' },
];

const getTextColor = (backgroundColor) => {
    const darkColors = ['#113536', '#0B698B', '#551c3b', '#3e2069'];
    return darkColors.includes(backgroundColor) ? '#fff' : '#000';
};

const App = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#9CD3D8');
    const [selectedKey, setSelectedKey] = useState(null);
    const [userName, setUserName] = useState('');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        const fullName = sessionStorage.getItem('fullName');
        console.log(fullName);
        if (fullName) {
            setUserName(fullName);
        }
    }, []);

    const navigate = useNavigate();
    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    const handleMenuItemClick = (key) => {
        setSelectedKey(key);
    };

    const textColor = getTextColor(selectedColor);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('fullName');
        message.success('Đăng xuất thành công');
        navigate('/');
    };

    return (
        <Layout className={cx('wrapper')}>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: selectedColor }}>
                <div className={cx('logo')}>Logo</div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ backgroundColor: selectedColor }}
                    popupStyle={{ backgroundColor: selectedColor }}
                >
                    <Menu.Item
                        key="1"
                        icon={<DashboardOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '1' })}
                        onClick={() => handleMenuItemClick('1')}
                        style={{ color: textColor }}
                    >
                        Tổng quan
                    </Menu.Item>
                    <Menu.Item
                        key="2"
                        icon={<ShoppingCartOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '2' })}
                        onClick={() => handleMenuItemClick('2')}
                        style={{ color: textColor }}
                        href="/product"
                    >
                        <Link to="/product" className={cx('text-Decoration_none')}>
                            Sản phẩm
                        </Link>
                    </Menu.Item>

                    <Menu.Item
                        key="8"
                        icon={<UnorderedListOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '8' })}
                        onClick={() => handleMenuItemClick('8')}
                        style={{ color: textColor }}
                    >
                        <Link to="/category" className={cx('text-Decoration_none')}>
                            Danh mục
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        icon={<UnorderedListOutlined style={{ color: textColor }} />}
                        title={<span style={{ color: textColor }}>Đơn hàng</span>}
                        popupStyle={{ backgroundColor: selectedColor }}
                        style={{ backgroundColor: collapsed ? selectedColor : undefined }}
                    >
                        <Menu.Item
                            key="3"
                            className={cx('custom-menu-item', { selected: selectedKey === '3', collapsed: collapsed })}
                            onClick={() => handleMenuItemClick('3')}
                            style={{ color: collapsed ? '#000' : textColor }}
                        >
                            <Link to="/invoice" className={cx('text-Decoration_none')}>
                                Đơn hàng
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key="4"
                            className={cx('custom-menu-item', { selected: selectedKey === '4' })}
                            onClick={() => handleMenuItemClick('4')}
                            style={{ color: collapsed ? '#000' : textColor }}
                        >
                            <Link to="/invoice" className={cx('text-Decoration_none')}>
                                Đơn trả hàng
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key="5"
                            className={cx('custom-menu-item', { selected: selectedKey === '5' })}
                            onClick={() => handleMenuItemClick('5')}
                            style={{ color: collapsed ? '#000' : textColor }}
                        >
                            Tình trạng giao
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item
                        key="6"
                        icon={<UserOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '6' })}
                        onClick={() => handleMenuItemClick('6')}
                        style={{ color: textColor }}
                    >
                        <Link to="/customer" className={cx('text-Decoration_none')}>
                            Khách hàng
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        key="7"
                        icon={<TeamOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '7' })}
                        onClick={() => handleMenuItemClick('7')}
                        style={{ color: textColor }}
                    >
                        Nhân viên
                    </Menu.Item>

                    <Menu.Item
                        key="9"
                        icon={<PieChartOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '9' })}
                        onClick={() => handleMenuItemClick('9')}
                        style={{ color: textColor }}
                    >
                        Báo cáo & Thống kê
                    </Menu.Item>
                    <Menu.Item
                        key="10"
                        icon={<FileTextOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '10' })}
                        onClick={() => handleMenuItemClick('10')}
                        style={{ color: textColor }}
                    >
                        Blog
                    </Menu.Item>
                    <Menu.Item
                        key="11"
                        icon={<CustomerServiceOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '11' })}
                        onClick={() => handleMenuItemClick('11')}
                        style={{ color: textColor }}
                    >
                        Hỗ trợ khách hàng
                    </Menu.Item>
                    <Menu.Item
                        key="12"
                        icon={<TagOutlined />}
                        className={cx('custom-menu-item', { selected: selectedKey === '12' })}
                        onClick={() => handleMenuItemClick('12')}
                        style={{ color: textColor }}
                    >
                        Giảm giá
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        className={cx('btn-OutLined')}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <Dropdown
                        overlay={
                            <Menu>
                                {colorOptions.map((option) => (
                                    <Menu.Item key={option.value} onClick={() => handleColorChange(option.value)}>
                                        <div style={{ backgroundColor: option.value, padding: '8px', color: '#fff' }}>
                                            {option.name}
                                        </div>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                    >
                        <Button style={{ backgroundColor: selectedColor, color: textColor }}>Chọn màu Theme</Button>
                    </Dropdown>

                    <div className={cx('user-info')}>
                        <Button type="link" style={{ color: textColor }}>
                            {userName ? `Xin chào, ${userName}` : 'Chào mừng'}
                        </Button>
                        <Button
                            type="link"
                            icon={<LogoutOutlined />}
                            style={{ color: textColor }}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </Button>
                    </div>
                </Header>
                <Content
                    className={cx('content')}
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;