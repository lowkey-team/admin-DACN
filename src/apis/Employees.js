import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fetchAllEmployeeAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/employees`);
    return response.data;
};

export const addEmployeeAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/employees`, formData);
    return response;
};

export const fetchEmployeeByIdAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/employees/${id}`);
    return response.data;
};