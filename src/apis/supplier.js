import { API_ROOT } from '../utils/contants';

import axios from 'axios';

const token = sessionStorage.getItem('token') || localStorage.getItem('token');
const axiosInstance = axios.create({
    baseURL: API_ROOT,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const fecthShowAllSupplierAPI = async () => {
    const response = await axiosInstance.get(`${API_ROOT}/v1/supplier/`);
    return response.data;
};

export const addNewSupplierAPI = async (formData) => {
    const response = await axiosInstance.post(`${API_ROOT}/v1/supplier`, formData);
    return response;
};

export const fetchSupplierByIdAPI = async (id) => {
    const response = await axiosInstance.get(`${API_ROOT}/v1/supplier/${id}`);
    return response.data;
};

export const updateSupplierAPI = async (id, formData) => {
    const response = await axiosInstance.put(`${API_ROOT}/v1/supplier/${id}`, formData);
    return response.data;
};

export const deleteSupplierAPI = async (id) => {
    const response = await axiosInstance.delete(`${API_ROOT}/v1/supplier/${id}`);
    return response.data;
};
