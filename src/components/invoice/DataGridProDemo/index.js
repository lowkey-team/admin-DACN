import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid'; // Sử dụng DataGrid từ MUI
import {
    Box,
    CircularProgress,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
} from '@mui/material'; // Các component của Material-UI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { fetchInvoiceAllAPI } from '~/apis/ProductAPI';
import DialogInvoiceDetail from '../DialogInvoiceDetail';

export default function InvoiceTable() {
    const [data, setData] = useState({ rows: [], columns: [] });
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [showDetailColumn, setShowDetailColumn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchInvoiceAllAPI();
                console.log('Data Invoice:', response); // Kiểm tra cấu trúc phản hồi API
                if (response.data && Array.isArray(response.data)) {
                    const invoices = response.data; // Đảm bảo dữ liệu là mảng
                    const formattedData = formatInvoiceData(invoices);
                    setData(formattedData);
                } else {
                    console.error('Lỗi khi lấy hóa đơn:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu hóa đơn:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatInvoiceData = (invoices) => {
        const columns = [
            { field: 'invoice_id', headerName: 'Mã Hóa Đơn', width: 200 },
            { field: 'customerName', headerName: 'Tên Khách Hàng', width: 180 },
            { field: 'phoneNumber', headerName: 'Số Điện Thoại', width: 130 },
            { field: 'totalAmount', headerName: 'Tổng Tiền', width: 100 },
            { field: 'discountAmount', headerName: 'Giảm Giá', width: 100 },
            { field: 'finalAmount', headerName: 'Thành Tiền', width: 100 },
            { field: 'voucherCode', headerName: 'Mã Voucher', width: 100 },
            { field: 'paymentStatus', headerName: 'Trạng Thái Thanh Toán', width: 150 },
            { field: 'orderStatus', headerName: 'Trạng Thái Đơn Hàng', width: 130 },
            { field: 'shippingAddress', headerName: 'Địa Chỉ Giao Hàng', width: 200 },
            { field: 'paymentMethod', headerName: 'Hình thức thanh toán', width: 100 },
            { field: 'createdAt', headerName: 'Ngày Tạo', width: 180 },
            {
                field: 'viewDetails',
                headerName: 'Xem Chi Tiết',
                width: 100,
                hide: !showDetailColumn,
                renderCell: (params) => (
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(params.row)}>
                        <FontAwesomeIcon icon={faFileInvoice} />
                    </Button>
                ),
            },
        ];

        const rows = invoices.map((invoice) => ({
            id: invoice.invoice_id,
            invoice_id: invoice.invoice_id,
            customerName: invoice.customerName,
            phoneNumber: invoice.phoneNumber || 'N/A',
            totalAmount: parseFloat(invoice.totalAmount).toLocaleString(),
            discountAmount: parseFloat(invoice.discountAmount).toLocaleString(),
            finalAmount: parseFloat(invoice.finalAmount).toLocaleString(),
            voucherCode: invoice.voucherCode || '...',
            paymentStatus: invoice.paymentStatus || 'N/A',
            orderStatus: invoice.orderStatus || 'N/A',
            shippingAddress: invoice.shippingAddress || 'N/A',
            paymentMethod: invoice.paymentMethod || 'N/A',
            createdAt: new Date(invoice.createdAt).toLocaleString(),
        }));

        return { rows, columns };
    };

    const handleViewDetails = (row) => {
        console.log('Viewing details for:', row);
        setInvoiceDetails(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setInvoiceDetails(null);
    };
    // Hàm để hiển thị cột "Xem chi tiết"
    const handleShowDetailColumn = () => {
        setShowDetailColumn(true);
    };

    return (
        <Box sx={{ width: '100%', height: 520 }}>
            {loading ? (
                <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
            ) : (
                <Paper sx={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        rows={data.rows}
                        columns={data.columns}
                        pageSize={10}
                        rowsPerPageOptions={[5, 10, 20]}
                        loading={loading}
                        disableSelectionOnClick
                        getRowId={(row) => row.id}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    totalAmount: false,
                                    customerName: false,
                                    createdAt: false,
                                    paymentMethod: false,
                                    voucherCode: false,
                                },
                            },
                        }}
                    />
                </Paper>
            )}

            <DialogInvoiceDetail invoiceDetails={invoiceDetails} open={open} onClose={handleClose} />
        </Box>
    );
}
