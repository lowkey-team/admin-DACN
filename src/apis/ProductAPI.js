import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fecthPorductAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/product`);
    return response.data;
};

// fetch product by id
export const fetchProductByIdAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/product/${id}`);
    return response.data;
};

export const fetchProductAllAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/product/getAll`);
    return response.data;
};

export const fetchCategoryAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/category`);
    return response.data;
};

export const AddProductAPI = async (formData) => {
    return await axios.post(`${API_ROOT}/v1/product`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const updateProductAPI = async (id, formData) => {
    return await axios.put(`${API_ROOT}/v1/product/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
