import classNames from 'classnames/bind';
import { Modal, Form, Input, Button, Checkbox  } from 'antd';
import styles from './ModalAddEmployees.module.scss';
import { useEffect, useState } from 'react';
import { fetchAllRolesAPI } from '~/apis/Roles';
import { addEmployeeAPI } from '~/apis/Employees';
const cx = classNames.bind(styles);

function ModalAddNewEmployees({ visible, onCancel, onAddEmployee }) {
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetchAllRolesAPI();
                setRoles(response);
                setLoadingRoles(false);
            } catch (error) {
                console.error('Lỗi khi lấy roles:', error);
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    const handleSubmit = async (values) => {
        try {
            const roleIds = values.roles.map(roleName => {
                const role = roles.find(r => r.name === roleName);
                return role ? role.id : null;
            }).filter(id => id !== null);

            const formData = {
                fullName: values.FullName,
                phone: values.Phone,
                password: values.Password,
                address: values.address,
                roleIds,
            };

            const response = await addEmployeeAPI(formData);

            if (response && response.data) {
                console.log('Thêm nhân viên thành công:', response.data);
                console.log('dữ liệu gửi đi:', formData)
                onAddEmployee(response.data);
                form.resetFields();
                onCancel();
            }
        } catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
        }
    };

    return (
        <Modal title="Thêm nhân viên mới" visible={visible} onCancel={onCancel} footer={null}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Họ và Tên"
                    name="FullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="Phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Tạo mật khẩu"
                    name="Password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input placeholder="Nhập địa chỉ" />
                </Form.Item>

                <Form.Item
                    label="Quyền"
                    name="roles"
                    rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}
                >
                    <Checkbox.Group>
                        {loadingRoles ? (
                            <div>Đang tải quyền...</div>
                        ) : (
                            roles.map(role => (
                                <Checkbox key={role.id} value={role.name}>
                                    {role.name}
                                </Checkbox>
                            ))
                        )}
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Thêm nhân viên
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalAddNewEmployees;
