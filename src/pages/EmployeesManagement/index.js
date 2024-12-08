import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Tag, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { fetchAllEmployeeAPI } from '~/apis/Employees';
import classNames from 'classnames/bind';

import styles from './EmployeesManagement.module.scss';
import ModalAddNewEmployees from '~/components/Modals/Employees/ModalAddEmployees';
import ModalEmployeeDetail from '~/components/Modals/Employees/ModalEmployeeDetails';
const cx = classNames.bind(styles);

function EmployeesManagement() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
    const [isEmployeeDetailModalVisible, setIsEmployeeDetailModalVisible] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            const data = await fetchAllEmployeeAPI();
            setEmployees(data);
        };

        fetchEmployees();
    }, []);

    const showAddEmployeeModal = () => {
        setIsAddEmployeeModalVisible(true);
    };

    const handleAddEmployeeModalCancel = () => {
        setIsAddEmployeeModalVisible(false);
    };

    const handleAddEmployee = (newEmployee) => {
        setEmployees([...employees, newEmployee]);
    };

    const handleViewDetails = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setIsEmployeeDetailModalVisible(true);
        console.log('Xem chi tiết nhân viên với ID:', employeeId);
    };

    const handleEmployeeDetailModalCancel = () => {
        setIsEmployeeDetailModalVisible(false);
    };

    const handleRoleUpdate = () => {
        const fetchEmployees = async () => {
            const data = await fetchAllEmployeeAPI();
            setEmployees(data);
        };
        fetchEmployees();
    };

    const columns = [
        {
            title: 'Họ và Tên',
            dataIndex: 'employeeName',
            key: 'employeeName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'Phone',
            key: 'Phone',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDelete',
            key: 'isDelete',
            render: (isDelete) => (
                <Tag color={isDelete === 1 ? 'volcano' : 'green'}>{isDelete === 1 ? 'Nghỉ làm' : 'Đang làm'}</Tag>
            ),
        },
        {
            title: 'Quyền',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => {
                const roleArray = Array.isArray(roles)
                    ? roles
                    : typeof roles === 'string'
                    ? roles.split(',').map((role) => role.trim())
                    : [];

                return (
                    <span>
                        {roleArray.length > 0
                            ? roleArray
                                  .map((role) => {
                                      if (role === 'Manager') return 'Quản lý';
                                      if (role === 'Employee') return 'Nhân viên';
                                      return role;
                                  })
                                  .join(', ')
                            : 'Không có quyền'}
                    </span>
                );
            },
        },
        {
            title: 'Xem chi tiết',
            key: 'action',
            render: (_, record) => (
                <FontAwesomeIcon
                    icon={faEye}
                    style={{ cursor: 'pointer', color: '#1890ff' }}
                    onClick={() => handleViewDetails(record.employeeId)}
                />
            ),
        },
    ];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header-page')}>
                <h2>Quản lý nhân viên</h2>
                <button className={cx('btn-addEmpl')} onClick={showAddEmployeeModal}>
                    + Thêm nhân viên mới
                </button>
                <ModalAddNewEmployees
                    visible={isAddEmployeeModalVisible}
                    onCancel={handleAddEmployeeModalCancel}
                    onAddEmployee={handleAddEmployee}
                />
            </div>

            <Table dataSource={employees} columns={columns} rowKey="id" pagination={false} />
            <ModalEmployeeDetail
                visible={isEmployeeDetailModalVisible}
                onCancel={handleEmployeeDetailModalCancel}
                employeeId={selectedEmployeeId}
                onRoleUpdate={handleRoleUpdate}
            />
        </div>
    );
}

export default EmployeesManagement;
