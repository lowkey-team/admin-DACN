import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fetchAllRolesAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/RoleSystem`);
    return response.data;
};

export const addRolesToEmployeeAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/RoleSystem/assign`, formData);
    return response;
};

export const deleteRoleEmployees = async (formData) => {
    const response = await axios.delete(`${API_ROOT}/v1/RoleSystem/remove`, {
        data: formData,
    });
    return response;
};
