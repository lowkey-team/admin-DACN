import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fecthShowAllCustomerAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/customer/`);
    return response.data;
};

export const fetchCustomerByIdAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/customer/${id}`);
    return response.data;
};

export const fetchTotalOrderCustomer = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/customer/order/${id}`);
    return response.data;
};

export const fetchAllOrderCustomer = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/customer/order/all/${id}`);
    return response.data;
};
