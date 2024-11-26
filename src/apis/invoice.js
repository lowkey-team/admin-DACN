import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fecthInvoiceByID_invoiceAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/invoices/detail/${id}`);
    return response;
};

export const fecthInvoiceDetailListID_invoiceAPI = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/invoices/detailInvoiceList/${id}`);
    return response.data;
};

export const updateInvoiceStatusAPI = async (formData) => {
    const response = await axios.put(`${API_ROOT}/v1/invoices/update`, formData);
    return response;
};
