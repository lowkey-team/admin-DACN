import classNames from 'classnames/bind';
import styles from './ModalEmployeeDetails.module.scss';
import { Modal, Form, Checkbox, Button } from 'antd';
import { fetchEmployeeByIdAPI } from '~/apis/Employees';
import { useEffect, useState } from 'react';
import { addRolesToEmployeeAPI, deleteRoleEmployees } from '~/apis/Roles';

const cx = classNames.bind(styles);

function ModalEmployeeDetail({ visible, onCancel, employeeId, onRoleUpdate }) {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        if (employeeId && visible) {
            const fetchEmployeeDetails = async () => {
                try {
                    const data = await fetchEmployeeByIdAPI(employeeId);
                    setEmployee(data);
                    const roles = data.roles.filter((role) => role.hasRole === 1).map((role) => role.roleName);
                    setSelectedRoles(roles);
                    setLoading(false);
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin nhân viên:', error);
                    setLoading(false);
                }
            };
            fetchEmployeeDetails();
        }
    }, [employeeId, visible]);

    const handleCheckboxChange = async (checkedValues) => {
        setSelectedRoles(checkedValues);

        const rolesToAdd = checkedValues.filter((roleName) => {
            const role = employee.roles.find((r) => r.roleName === roleName);
            return role && role.hasRole === 0;
        });

        for (const roleName of rolesToAdd) {
            const role = employee.roles.find((r) => r.roleName === roleName);
            const formData = {
                employee_id: employee.employeeId,
                role_id: role.idRole,
            };
            try {
                await addRolesToEmployeeAPI(formData);
            } catch (error) {
                console.error(`Lỗi khi thêm quyền ${roleName}:`, error);
            }
        }

        const rolesToRemove = employee.roles
            .filter((role) => !checkedValues.includes(role.roleName) && role.hasRole === 1)
            .map((role) => ({
                employee_id: employee.employeeId,
                role_id: role.idRole,
            }));

        for (const formData of rolesToRemove) {
            try {
                console.log('Xóa quyền:', formData);
                await deleteRoleEmployees(formData);
            } catch (error) {
                console.error(`Lỗi khi xóa quyền ${formData.role_id}:`, error);
            }
        }

        const updatedRoles = employee.roles.filter(
            (role) => !rolesToRemove.some((removeRole) => removeRole.role_id === role.idRole),
        );
        setEmployee({ ...employee, roles: updatedRoles });

        if (onRoleUpdate) onRoleUpdate();
    };

    if (loading || !employee) return <div>Đang tải...</div>;

    return (
        <Modal
            title="Chi tiết nhân viên"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>,
            ]}
        >
            <div>
                <h4>Họ và tên: {employee.FullName}</h4>
                <p>Số điện thoại: {employee.Phone}</p>
                <p>Địa chỉ: {employee.address}</p>
                <p>Ngày vào làm: {new Date(employee.createdAt).toLocaleDateString()}</p>

                <Form>
                    <Form.Item label="Quyền">
                        <Checkbox.Group value={selectedRoles} onChange={handleCheckboxChange}>
                            {employee.roles.map((role) => (
                                <Checkbox key={role.idRole} value={role.roleName}>
                                    {role.roleName}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default ModalEmployeeDetail;
