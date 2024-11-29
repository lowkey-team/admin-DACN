import { API_ROOT } from '../utils/contants';

import axios from 'axios';


export const AddDiscountVariantAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/VariationDiscountRouter`, formData);
    return response;
};