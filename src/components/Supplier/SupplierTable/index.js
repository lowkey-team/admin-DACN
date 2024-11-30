import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Paper, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { fecthShowAllSupplierAPI } from '~/apis/supplier';
import { fetchSupplierByIdAPI } from '~/apis/supplier';  
import ModalDetailSupplier from '../ModalDetailSupplier';


export default function SupplierTable() {
    const [data, setData] = useState({ rows: [], columns: [] });
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [supplierDetails, setSupplierDetails] = useState(null);
    const [showDetailColumn, setShowDetailColumn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fecthShowAllSupplierAPI();
                if (response && Array.isArray(response)) {
                    const suppliers = response;
                    const formattedData = formatSupplierData(suppliers);
                    setData(formattedData);
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
            { field: 'id', headerName: 'Mã Số', width: 50 },
            { field: 'SupplierName', headerName: 'Tên Nhà Cung Cấp', width: 360 },
            { field: 'phoneNumber', headerName: 'Số Điện Thoại', width: 180 },
            { field: 'Email', headerName: 'Email', width: 280 },
            { field: 'contactPerson', headerName: 'Người Liên Hệ', width: 230 },
            {
                field: 'viewDetails',
                headerName: 'Xem Chi Tiết',
                width: 120,
                hide: !showDetailColumn,
                renderCell: (params) => (
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(params.row.id)}>
                        <FontAwesomeIcon icon={faFileInvoice} />
                    </Button>
                ),
            },
        ];

        const rows = suppliers.map((supplier) => ({
            id: supplier.id,
            SupplierName: supplier.SupplierName,
            phoneNumber: supplier.phoneNumber || 'N/A',
            Email: supplier.Email || 'N/A',
            contactPerson: supplier.contactPerson || 'N/A',
            createdAt: new Date(supplier.createdAt).toLocaleString(),
        }));

        return { rows, columns };
    };

    const handleViewDetails = async (id) => {
        try {
            const response = await fetchSupplierByIdAPI(id);
            setSupplierDetails(response); 
            setOpenModal(true); 
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết nhà cung cấp:', error);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSupplierDetails(null);
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
                    />
                </Paper>
            )}

            <ModalDetailSupplier 
                open={openModal} 
                onClose={handleCloseModal} 
                supplierDetails={supplierDetails} 
            />
        </Box>
    );
}
