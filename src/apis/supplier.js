import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fecthShowAllSupplierAPI = async () => {
    const response = await axios.get(`${API_ROOT}/v1/supplier/`);
    return response.data;
};
