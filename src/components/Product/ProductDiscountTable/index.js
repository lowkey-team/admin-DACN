import React, { useState } from 'react';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import ProductRowDiscount from '../ProductRowDiscount';

export default function ProductDiscountTable({ currentRows, onVariationSelect }) {
    const [selectedVariations, setSelectedVariations] = useState([]);

    // Xử lý khi người dùng chọn biến thể của sản phẩm
    const handleVariationSelection = (productId, variation) => {
        onVariationSelect(productId, variation);
    };

    // Kiểm tra trường hợp không có sản phẩm
    if (currentRows.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>Không có sản phẩm nào để hiển thị</h3>
            </div>
        );
    }

    return (
        <Sheet style={{ overflowX: 'auto' }}>
            <Table
                aria-label="collapsible table"
                sx={{
                    '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)': {
                        textAlign: 'right',
                    },
                    '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]': {
                        borderBottom: 0,
                    },
                    padding: '16px',
                }}
            >
                <thead>
                    <tr>
                        <th style={{ width: 40 }} aria-label="empty" />
                        <th style={{ width: 50 }}></th>
                        <th style={{ display: 'flex', justifyContent: 'start' }}>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Danh mục con</th>
                        <th>Ngày cập nhật</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row) => (
                        <ProductRowDiscount 
                            key={row.product_id} 
                            row={row}
                            initialOpen={false} 
                            onVariationSelect={handleVariationSelection} 
                        />
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}
