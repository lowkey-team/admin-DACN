import classNames from 'classnames/bind';
import styles from './RolesManagementPage.module.scss';
import { useEffect, useState } from 'react';
import { Checkbox, Row, Col, Radio } from 'antd';
import { fetchAllRolesAPI } from '~/apis/Roles';
import { fetchPremisstionByRoleIdAPI } from '~/apis/Premission';
import { addPremissionToRoleIdAPI } from '~/apis/Premission'; // Import API

const cx = classNames.bind(styles);

function RolesManagementPage() {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await fetchAllRolesAPI();
                setRoles(data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách quyền:', error);
            }
        };

        loadRoles();
    }, []);

    const handleRoleCheckboxChange = async (e) => {
        const roleId = e.target.value;
        setSelectedRoles([roleId]);

        const updatedPermissions = {};
        const permissionsData = await fetchPremisstionByRoleIdAPI(roleId);
        updatedPermissions[roleId] = permissionsData;
        setPermissions(updatedPermissions);
    };

    const handlePermissionCheckboxChange = async (roleId, checkedValues) => {
        const updatedPermissions = { ...permissions };

        updatedPermissions[roleId] = updatedPermissions[roleId].map((permission) => ({
            ...permission,
            hasPermission: checkedValues.includes(permission.permissionId) ? 1 : 0,
        }));
        setPermissions(updatedPermissions);

        for (const permissionId of checkedValues) {
            const permission = updatedPermissions[roleId].find((perm) => perm.permissionId === permissionId);
            if (permission && permission.hasPermission === 1) {
                const formData = {
                    role_id: roleId,
                    permission_id: permissionId,
                };
                try {
                    await addPremissionToRoleIdAPI(formData);
                    console.log(`Thêm permission ${permission.permissionName} vào role ${roleId}`);
                } catch (error) {
                    console.error(`Lỗi khi thêm permission ${permission.permissionName}:`, error);
                }
            }
        }
    };

    return (
        <div className={cx('wrapper', 'container-fill')}>
            <div className={cx('row')}>
                <div className={cx('col-md-12')}>
                    <h4>Danh sách các quyền</h4>
                </div>

                <div className={cx('col-md-12')}>
                    <Radio.Group
                        className={cx('form-roles')}
                        value={selectedRoles[0]}
                        onChange={handleRoleCheckboxChange}
                    >
                        <Row>
                            {roles.map((role) => (
                                <Col className={cx('rd-form')} key={role.id}>
                                    <Radio value={role.id}>{role.name}</Radio>
                                </Col>
                            ))}
                        </Row>
                    </Radio.Group>
                </div>
            </div>
            <div className={cx('row')}>
                <div className={cx('col-md-12')}>
                    <h4 className={cx('text-center')}>Danh sách các chức năng</h4>
                    {selectedRoles.length > 0 &&
                        selectedRoles.map((roleId) => (
                            <div key={roleId} className={cx('row', 'mt-4')}>
                                <div className={cx('col-md-12')}>
                                    <h4>Chức năng của quyền: {roles.find((role) => role.id === roleId)?.name}</h4>
                                    <Checkbox.Group
                                        value={permissions[roleId]
                                            ?.filter((permission) => permission.hasPermission === 1)
                                            .map((permission) => permission.permissionId)}
                                        onChange={(checkedValues) =>
                                            handlePermissionCheckboxChange(roleId, checkedValues)
                                        }
                                    >
                                        <Row>
                                            {permissions[roleId]?.map((permission) => (
                                                <Col span={8} key={permission.permissionId}>
                                                    <Checkbox className={cx('rd-form')} value={permission.permissionId}>
                                                        {permission.permissionName}
                                                    </Checkbox>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Checkbox.Group>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default RolesManagementPage;
