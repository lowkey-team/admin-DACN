import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Paper, Button, Dialog } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { showAllOrderSupplierAPI } from '~/apis/warehoues';
import ModelOrderSupplierDetail from '../ModelOrderSupplierDetail';
import { useSelector } from 'react-redux';
// import DialogInvoiceDetail from '../DialogInvoiceDetail';

export default function SupplierOrderTable() {
    const [tableData, setTableData] = useState({ rows: [], columns: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [showDetailColumn, setShowDetailColumn] = useState(false);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [supplierOrders, setSupplierOrders] = useState([]);

    const userPermissions = useSelector((state) => state.user.permissions);

    const canUpdateOrderImport = userPermissions.includes('Quản lý kho - Cập nhật đơn quản lý kho');
    const canViewDetailOrderImport = userPermissions.includes('Quản lý kho - Xem chi tiết đơn quản lý kho');

    const fetchSupplierOrders = async () => {
        try {
            const response = await showAllOrderSupplierAPI();
            console.log('Data Supplier:', response);
            if (response && Array.isArray(response)) {
                const formattedData = mapSupplierOrdersToTable(response);
                setTableData(formattedData);
            } else {
                console.error('Lỗi khi lấy đơn hàng nhà cung cấp:', response.message);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu đơn hàng nhà cung cấp:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchSupplierOrders();
    }, []);

    const mapSupplierOrdersToTable = (orders) => {
        const columns = [
            { field: 'id', headerName: 'Mã Đơn Hàng', width: 180 },
            { field: 'employee_name', headerName: 'Nhân Viên', width: 180 },
            { field: 'employee_phone', headerName: 'Số Điện Thoại NV', width: 150 },
            { field: 'supplier_name', headerName: 'Tên Nhà Cung Cấp', width: 180 },
            { field: 'supplier_phone', headerName: 'Số Điện Thoại NCC', width: 150 },
            { field: 'supplier_address', headerName: 'Địa Chỉ NCC', width: 180 },
            { field: 'TotalPrice', headerName: 'Tổng Giá', width: 120 },
            { field: 'OrderDate', headerName: 'Ngày Đặt', width: 180 },
            { field: 'DateOfReceipt', headerName: 'Ngày Nhận', width: 180 },
            {
                field: 'viewDetails',
                headerName: '',
                width: 120,
                hide: !showDetailColumn,
                renderCell: (params) => {
                    return canViewDetailOrderImport ? (
                        <Button variant="contained" color="primary" onClick={() => openOrderDetailsDialog(params.row)}>
                            <FontAwesomeIcon icon={faFileInvoice} />
                        </Button>
                    ) : null;
                },
            },
        ];

        const rows = orders.map((order) => ({
            id: order.orderSupplier_id,
            employee_name: order.employee_name,
            employee_phone: order.employee_phone,
            supplier_name: order.supplier_name,
            supplier_phone: order.supplier_phone,
            supplier_address: order.supplier_address,
            TotalPrice: order.TotalPrice,
            OrderDate: new Date(order.OrderDate).toLocaleString(),
            DateOfReceipt: new Date(order.DateOfReceipt).toLocaleString(),
            TotalPrice: order.TotalPrice,
            order_status: order.order_status,
            payment_status: order.payment_status,
            OrderDate: new Date(order.OrderDate).toLocaleString(),
            DateOfReceipt: new Date(order.DateOfReceipt).toLocaleString(),
        }));

        return { rows, columns };
    };

    const openOrderDetailsDialog = (row) => {
        setSelectedOrderDetails(row);
        setIsDialogOpen(true);
    };

    const closeOrderDetailsDialog = () => {
        setIsDialogOpen(false);
        setSelectedOrderDetails(null);
    };

    const toggleDetailsColumnVisibility = () => {
        setShowDetailColumn(true);
    };

    const paginatedData = supplierOrders.slice(page * pageSize, page * pageSize + pageSize);

    return (
        <Box sx={{ width: '100%', height: 520 }}>
            {isLoading ? (
                <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
            ) : (
                <Paper sx={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        rows={tableData.rows}
                        columns={tableData.columns}
                        pageSize={10}
                        rowsPerPageOptions={[5, 10, 20]}
                        loading={isLoading}
                        disableSelectionOnClick
                        getRowId={(row) => row.id}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    address: false,
                                    supplier_phone: false,
                                    DateOfReceipt: false,
                                },
                            },
                        }}
                    />
                </Paper>
            )}

            <ModelOrderSupplierDetail
                invoiceDetails={selectedOrderDetails}
                open={isDialogOpen}
                fetchSupplierOrders={fetchSupplierOrders}
                onClose={closeOrderDetailsDialog}
            />
        </Box>
    );
}
