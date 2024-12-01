import React, { useState } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import styles from './Login.module.scss';
import { useDispatch } from 'react-redux';
import { setUser } from '~/redux/userSlice';

import { loginAdminAPI } from '~/apis/Auth';

const cx = classNames.bind(styles);

function Login() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        const { phone, password } = values;

        setLoading(true);

        try {
            const response = await loginAdminAPI({ phone, password });
            setIsModalOpen(true);
            sessionStorage.setItem(
                'user',
                JSON.stringify({
                    id: response.id,
                    fullName: response.fullName,
                    roles: response.roles,
                    permissions: response.permissions,
                    token: response.token,
                }),
            );

            dispatch(
                setUser({
                    id: response.id,
                    fullName: response.fullName,
                    roles: response.roles,
                    permissions: response.permissions,
                    token: response.token,
                }),
            );

            setTimeout(() => {
                setIsModalOpen(false);
                console.log('Đăng nhập thành công fgvhbn:', response);

                navigate('/overview');
            }, 1000);

            console.log('Đăng nhập thành công:', response);
        } catch (error) {
            setLoading(false);
            message.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin');
            console.error('Lỗi đăng nhập:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('login-container')}>
                <div className={cx('logo')}>
                    <img src="https://picsum.photos/300/300" alt="Logo" />
                </div>
                <h2 className={cx('title')}>Chào mừng</h2>
                <Form onFinish={handleSubmit} className={cx('form')}>
                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại của bạn!' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            type="tel"
                            placeholder="Nhập số điện thoại của bạn"
                            maxLength={10}
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} type="password" placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>

                <div className={cx('footer')}>
                    <a href="/forgot-password">Quên mật khẩu?</a>
                </div>
            </div>

            <Modal title="Thông báo" open={isModalOpen} footer={null} closable={false}>
                <p>Đăng nhập thành công! Chào mừng bạn.</p>
            </Modal>
        </div>
    );
}

export default Login;
