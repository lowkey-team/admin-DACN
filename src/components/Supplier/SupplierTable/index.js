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
import { fecthShowAllSupplierAPI } from '~/apis/supplier';
// import DialogInvoiceDetail from '../DialogInvoiceDetail';

export default function SupplierTable() {
    const [data, setData] = useState({ rows: [], columns: [] });
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [supplierDetails, setSupplierDetails] = useState(null);
    const [showDetailColumn, setShowDetailColumn] = useState(false);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [allData, setAllData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fecthShowAllSupplierAPI();
                console.log('Data Supplier:', response);
                if (response && Array.isArray(response)) {
                    const suppliers = response;
                    const formattedData = formatSupplierData(suppliers);
                    setData(formattedData);
                } else {
                    console.error('Lỗi khi lấy nhà cung cấp:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu nhà cung cấp:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatSupplierData = (suppliers) => {
        const columns = [
            { field: 'id', headerName: 'Mã Nhà Cung Cấp', width: 50 },
            { field: 'SupplierName', headerName: 'Tên Nhà Cung Cấp', width: 180 },
            { field: 'address', headerName: 'Địa Chỉ', width: 180 },
            { field: 'phoneNumber', headerName: 'Số Điện Thoại', width: 150 },
            { field: 'Email', headerName: 'Email', width: 180 },
            { field: 'contactPerson', headerName: 'Người Liên Hệ', width: 180 },
            { field: 'createdAt', headerName: 'Ngày Tạo', width: 180 },
            {
                field: 'viewDetails',
                headerName: 'Xem Chi Tiết',
                width: 120,
                hide: !showDetailColumn,
                renderCell: (params) => (
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(params.row)}>
                        <FontAwesomeIcon icon={faFileInvoice} />
                    </Button>
                ),
            },
        ];

        const rows = suppliers.map((supplier) => ({
            id: supplier.id,
            SupplierName: supplier.SupplierName,
            address: supplier.address || 'N/A',
            phoneNumber: supplier.phoneNumber || 'N/A',
            Email: supplier.Email || 'N/A',
            contactPerson: supplier.contactPerson || 'N/A',
            createdAt: new Date(supplier.createdAt).toLocaleString(),
        }));

        return { rows, columns };
    };

    const handleViewDetails = (row) => {
        console.log('Viewing details for:', row);
        setSupplierDetails(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSupplierDetails(null);
    };

    // Hàm để hiển thị cột "Xem chi tiết"
    const handleShowDetailColumn = () => {
        setShowDetailColumn(true);
    };
    // Xử lý phân trang client-side
    const paginatedData = allData.slice(page * pageSize, page * pageSize + pageSize);
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
                        // initialState={{
                        //     columns: {
                        //         columnVisibilityModel: {
                        //             address: false,
                        //             phoneNumber: false,
                        //             createdAt: false,
                        //         },
                        //     },
                        // }}
                    />
                </Paper>
            )}

            {/* <DialogInvoiceDetail invoiceDetails={supplierDetails} open={open} onClose={handleClose} /> */}
        </Box>
    );
}
