import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const showAllOrderSupplierAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/orderSupplier/GetALL`);
    return response.data;
};

export const addNewWarehouseAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/orderSupplier/create`, formData);
    return response;
};

export const findByIdOrderSupplierAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/orderSupplier/${id}`);
    return response.data;
};

export const updateOrderSupplierAPI = async (fromData) => {
    const response = await axios.put(`${API_ROOT}/v1/orderSupplier/updateStatus`, fromData);
    return response;
};

export const updateOrderSupplierDetailsAPI = async (fromData) => {
    const response = await axios.put(`${API_ROOT}/v1/orderSupplier/updateOrderDetail`, fromData);
    return response;
};
