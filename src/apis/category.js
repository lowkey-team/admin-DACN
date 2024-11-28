import { API_ROOT } from '../utils/contants';

import axios from 'axios';

const token = sessionStorage.getItem('token') || localStorage.getItem('token');
const axiosInstance = axios.create({
    baseURL: API_ROOT,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const getAllCategoryAPI = async () => {
    const response = await axiosInstance.get(`${API_ROOT}/v1/category`);
    return response.data;
};

export const addCategoryAPI = async (formData) => {
    const response = await axiosInstance.post(`${API_ROOT}/v1/category`, formData);
    return response;
};

export const addSubCategoryAPI = async (formData) => {
    const response = await axiosInstance.post(`${API_ROOT}/v1/category/addSubcategories`, formData);
    return response;
};

export const updateCategoryAPI = async (id, formData) => {
    const response = await axiosInstance.put(`${API_ROOT}/v1/category/${id}`, formData);
    return response;
};

export const updateSubCategoryAPI = async (id, formData) => {
    const response = await axiosInstance.put(`${API_ROOT}/v1/category/subcategories/${id}`, formData);
    return response;
};

export const deleteCategoryAPI = async (id) => {
    const response = await axiosInstance.delete(`${API_ROOT}/v1/category/${id}`);
    return response;
};
export const deleteSubCategoryAPI = async (id) => {
    const response = await axiosInstance.delete(`${API_ROOT}/v1/category/subcategories/${id}`);
    return response;
};
