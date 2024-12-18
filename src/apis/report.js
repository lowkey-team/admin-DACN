import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fetchSalesReportAPI = async (startDate, endDate) => {
    const response = await axios.post(`${API_ROOT}/v1/invoices/GetSalesReport/getll`, {
        startDate: startDate,
        endDate: endDate,
    });
    return response.data;
};
