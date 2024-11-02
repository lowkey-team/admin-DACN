// ProductRow.js
import React, { useState } from 'react';
import IconButton from '@mui/joy/IconButton';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatDateTime } from '~/utils/dateUtils';
import { Button } from 'antd';
import ProductDetailModal from '../ProductDetailModal';

export default function ProductRow({ row, initialOpen = false }) {
    const [open, setOpen] = useState(initialOpen);
    const [modalVisible, setModalVisible] = useState(false);

    const handleShowModal = () => {
        setModalVisible(true);
    };

    const handleHideModal = () => {
        setModalVisible(false);
    };
    return (
        <>
            <tr>
                <td>
                    <IconButton
                        aria-label="expand row"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </td>
                <td>
                    <img width="40px" height="40px" alt={row.productName} src={row.images || ''} />
                </td>
                <th>{row.productName}</th>
                <td>{row.category_name}</td>
                <td>{row.subcategory_name}</td>
                <td>{formatDateTime(row.createdAt)}</td>
                <td>
                    <Button color="default" variant="dashed" onClick={handleShowModal} productID={row.id}>
                        Detail
                    </Button>

                    <Button color="default" variant="dashed">
                        Edit
                    </Button>
                    <Button color="default" variant="dashed">
                        Delete
                    </Button>
                </td>
            </tr>
            <tr>
                <td style={{ height: 0, padding: 0 }} colSpan={7}>
                    {open && (
                        <Sheet variant="soft" sx={{ p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)' }}>
                            <Typography level="body-lg" component="div">
                                Chi tiết sản phẩm
                            </Typography>
                            <Table
                                borderAxis="bothBetween"
                                size="sm"
                                aria-label="product variations"
                                sx={{
                                    '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)': {
                                        textAlign: 'right',
                                    },
                                    '--TableCell-paddingX': '0.5rem',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Kích cỡ</th>
                                        <th>Giá (VND)</th>
                                        <th>Số lượng trong kho</th>
                                        <th>Giảm giá (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.variations.map((variation, index) => (
                                        <tr key={index}>
                                            <td>{variation.size || 'N/A'}</td>
                                            <td>{variation.price ? variation.price.toLocaleString() : 'N/A'}</td>
                                            <td>{variation.stock !== null ? variation.stock : 'N/A'}</td>
                                            <td>{variation.discount !== null ? `${variation.discount}%` : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </td>
            </tr>

            <ProductDetailModal productID={row.product_id} open={modalVisible} onClose={handleHideModal} />
        </>
    );
}
