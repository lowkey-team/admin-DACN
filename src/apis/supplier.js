import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fecthShowAllSupplierAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/supplier/`);
    return response.data;
};

export const addNewSupplierAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/supplier`, formData);
    return response;
};

export const fetchSupplierByIdAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/supplier/${id}`);
    return response.data;
};

export const updateSupplierAPI = async (id, formData) => {
    const response = await axios.put(`${API_ROOT}/v1/supplier/${id}`, formData);
    return response.data;
};

export const deleteSupplierAPI = async (id) => {
    const response = await axios.delete(`${API_ROOT}/v1/supplier/${id}`);
    return response.data;
};

