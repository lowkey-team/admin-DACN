import { API_ROOT } from '../utils/contants';

import axios from 'axios';

const token = sessionStorage.getItem('token') || localStorage.getItem('token');
const axiosInstance = axios.create({
    baseURL: API_ROOT,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const getAllDiscountAPI = async () => {
    const response = await axiosInstance.get(`${API_ROOT}/v1/discount/`);
    return response.data;
};

export const AddDiscountAPI = async (formData) => {
    return await axios.post(`${API_ROOT}/v1/product`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};