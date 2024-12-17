import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const fetchAllReturnDetail = async (id) => {
    const response = await axios.get(`${API_ROOT}/v1/return/return-details`);
    return response.data;
};
