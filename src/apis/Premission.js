import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fetchPremisstionByRoleIdAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/RoleSystem/${id}`);
    return response.data;
};

export const addPremissionToRoleIdAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/roles/`, formData);
    return response;
};

export const deletePremissionRole = async (roleId, permissionId) => {
    const response = await axios.delete(`${API_ROOT}/v1/roles/DeleteRolesPermission`, {
        data: { role_id: roleId, permission_id: permissionId },
    });
    return response.data;
};
