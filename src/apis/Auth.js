import { API_ROOT } from '../utils/contants';

import axios from 'axios';

export const loginAdminAPI = async (formData) => {
    const response = await axios.get(`${API_ROOT}/v1/Auth/login`, formData);
    return response;
};
