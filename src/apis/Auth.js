import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const loginAdminAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/Auth/login`, formData);
    return response.data;
};
