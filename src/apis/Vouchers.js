import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const getAllVoucherAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1//voucher/all/voucher`);
    return response.data;
};

export const addNewVoucherAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/voucher/`, formData);
    return response;
};

export const updateVoucherAPI = async (id, formData) => {
    const response = await axios.put(`${API_ROOT}/v1/voucher/${id}`, formData);
    return response.data;
};

export const deleteVoucherAPI = async (id) => {
    const response = await axios.delete(`${API_ROOT}/v1/voucher/${id}`);
    return response.data;
};
