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
    console.log('router', id, formData);
    return await axios.put(`${API_ROOT}/v1/product/${id}`, formData);
};

export const addImageAPI = async (formData) => {
    return await axios.post(`${API_ROOT}/v1/image/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const removeImageAPI = async (deleteData) => {
    try {
        const response = await axios.delete(`${API_ROOT}/v1/image/images`, {
            data: deleteData,
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa hình ảnh:', error);
        throw error;
    }
};

export const addVariationAPI = async function (formData) {
    const response = await axios.post(`${API_ROOT}/v1/variation/bulk`, formData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const updateVariationAPI = async function (formData) {
    const response = await axios.put(`${API_ROOT}/v1/variation/bulk`, formData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

export const importProductAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/product/products`, formData);
    return response;
};

export const fetchInvoiceAllAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/invoices/invoicesAll`);
    return response;
};

export const fetchProductByIdSupCategoryAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/product/getProductBySupAdmin/${id}`);
    return response.data;
};
export const fetchProductBySubAdminAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/product/getProductBySupAdmin/${id}`);

    return response.data;
};
