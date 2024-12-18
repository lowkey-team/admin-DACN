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

export const exportToExcelSALE = async (salesReport) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SalesReport');

        // Thiết lập các cột với header và key
        worksheet.columns = [
            { header: 'Tên sản phẩm', key: 'ProductName', width: 30 },
            { header: 'Biến thể', key: 'VariantName', width: 20 },
            { header: 'Số lượng đã bán', key: 'QuantitySold', width: 15 },
            { header: 'Giá bán', key: 'SellingPrice', width: 15 },
            { header: 'Tổng tiền', key: 'TotalAmount', width: 15 },
        ];

        // Tô màu header
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4CAF50' }, // Màu xanh lá
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }, // Màu chữ trắng
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Thêm dữ liệu vào worksheet
        salesReport.forEach((item) => {
            worksheet.addRow({
                ProductName: item.ProductName,
                VariantName: item.VariantName,
                QuantitySold: item.QuantitySold,
                SellingPrice: item.SellingPrice,
                TotalAmount: item.TotalAmount,
            });
        });

        // Thêm viền cho tất cả các ô dữ liệu
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                // Bỏ qua header
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

        // Xuất file Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Tạo link và download file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'SalesReport.xlsx';
        link.click();

        console.log('Xuất file Excel thành công!');
    } catch (error) {
        console.error('Lỗi khi xuất file Excel:', error);
    }
};
