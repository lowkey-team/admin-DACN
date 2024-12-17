import { API_ROOT } from '../utils/contants';

import axios from 'axios';

// export const AddDiscountVariantAPI = async (formData) => {
//     const response = await axios.post(`${API_ROOT}/v1/VariationDiscountRouter`, formData);
//     return response;
// };

export const getProductVariationsAPI = async (categoryId, subCategoryId) => {
    const response = await axios.get(`${API_ROOT}/v1/VariationDiscountRouter/variations`, {
        params: { categoryId, subCategoryId },
    });
    return response.data;
};

export const AddDiscountVariantAPI = async (formData) => {
    const response = await axios.post(`${API_ROOT}/v1/VariationDiscountRouter/bulk`, formData);
    return response;
};
