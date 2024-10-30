// ProductTable.js
import React from 'react';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import ProductRow from '../ProductRow';

export default function ProductTable({ currentRows }) {
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
                        <th>Ngày tạo</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row) => (
                        <ProductRow key={row.product_id} row={row} initialOpen={false} />
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}
