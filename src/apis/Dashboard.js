import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const countAllProductAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/dashboard/product`);
    return response.data;
};

export const countAllOrdersTodayAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/dashboard/order`);
    return response.data;
};

export const countNewCustomerAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/dashboard/customer`);
    return response.data;
};

export const totalRevenueAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/dashboard/revenue`);
    return response.data;
};

export const monthlyRevenueAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/dashboard/monthlyrevenue`);
    return response.data;
};

export const productVariantRevenueAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/dashboard/product-variation-revenue`);
    return response.data;
};
