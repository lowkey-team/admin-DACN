import { utils, writeFile } from 'xlsx';
export const exportToExcel = (rows) => {
    const exportData = [];

    rows.forEach((product) => {
        if (product.variations && product.variations.length > 0) {
            product.variations.forEach((variation) => {
                exportData.push({
                    product_id: product.product_id,
                    productName: product.productName,
                    category_name: product.category_name,
                    subcategory_name: product.subcategory_name,
                    createdAt: product.createdAt,
                    size: variation.size || 'N/A',
                    price: variation.price !== null ? variation.price : 'N/A',
                    stock: variation.stock !== null ? variation.stock : 'N/A',
                    discount: variation.discount !== null ? variation.discount : 'N/A',
                });
            });
        } else {
            exportData.push({
                product_id: product.product_id,
                productName: product.productName,
                category_name: product.category_name,
                subcategory_name: product.subcategory_name,
                createdAt: product.createdAt,
                size: 'N/A',
                price: 'N/A',
                stock: 'N/A',
                discount: 'N/A',
            });
        }
    });

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Products');

    writeFile(workbook, 'Products.xlsx');
};
