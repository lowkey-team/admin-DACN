import ExcelJS from 'exceljs';

export const exportToExcel = (rows) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Thiết lập các cột với header và key
    worksheet.columns = [
        { header: 'Mã sản phẩm ', key: 'product_id', width: 15 },
        { header: 'Tên sản phẩm', key: 'productName', width: 30 },
        { header: 'Danh mục cha', key: 'category_name', width: 20 },
        { header: 'Danh mục con', key: 'subcategory_name', width: 20 },
        { header: 'Ngày tạo sản phẩm', key: 'createdAt', width: 15 },
        { header: 'Kích cỡ sản phẩm', key: 'size', width: 20 },
        { header: 'Giá bán', key: 'price', width: 15 },
        { header: 'Số lượng tồn kho', key: 'stock', width: 15 },
        { header: 'Giảm giá', key: 'discount', width: 15 },
    ];

    // Tô màu xanh cho header
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4CAF50' }, // Màu xanh lá
        };
        cell.font = {
            bold: true, // Làm đậm chữ
            color: { argb: 'FFFFFFFF' }, // Màu chữ trắng
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Canh giữa
    });

    // Dữ liệu sản phẩm
    rows.forEach((product) => {
        if (product.variations && product.variations.length > 0) {
            product.variations.forEach((variation) => {
                const row = worksheet.addRow({
                    product_id: product.product_id,
                    productName: product.productName,
                    category_name: product.category_name,
                    subcategory_name: product.subcategory_name,
                    createdAt: new Date(product.createdAt).toLocaleDateString(), // Định dạng ngày tháng
                    size: variation.size || 'N/A',
                    price: variation.price !== null ? variation.price : 'N/A',
                    stock: variation.stock !== null ? variation.stock : 'N/A',
                    discount: variation.discount !== null ? variation.discount : 'N/A',
                });

                // Thêm viền cho các ô dữ liệu
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                });
            });
        } else {
            const row = worksheet.addRow({
                product_id: product.product_id,
                productName: product.productName,
                category_name: product.category_name,
                subcategory_name: product.subcategory_name,
                createdAt: new Date(product.createdAt).toLocaleDateString(), // Định dạng ngày tháng
                size: 'N/A',
                price: 'N/A',
                stock: 'N/A',
                discount: 'N/A',
            });

            // Thêm viền cho các ô dữ liệu
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        }
    });

    // Tự động điều chỉnh độ rộng cột
    worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? cell.value.toString() : '';
            maxLength = Math.max(maxLength, cellValue.length);
        });
        column.width = maxLength + 2;
    });

    // Xuất file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Products.xlsx';
        link.click();
    });
};
