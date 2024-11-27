import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const getAllCategoryAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/category`);
    return response.data;
};

export const addCategoryAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/category`, formData);
    return response;
};

export const addSubCategoryAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/category/addSubcategories`, formData);
    return response;
};

export const updateCategoryAPI = async (id, formData) => {
    const response = await axios.put(`${API_ROOT}/v1/category/${id}`, formData);
    return response;
};

export const updateSubCategoryAPI = async (id, formData) => {
    const response = await axios.put(`${API_ROOT}/v1/category/subcategories/${id}`, formData);
    return response;
};

export const deleteCategoryAPI = async (id) => {
    const response = await axios.delete(`${API_ROOT}/v1/category/${id}`);
    return response;
};
export const deleteSubCategoryAPI = async (id) => {
    const response = await axios.delete(`${API_ROOT}/v1/category/subcategories/${id}`);
    return response;
};
