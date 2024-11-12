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
import classNames from 'classnames/bind';

import ProductDetailModal from '../ProductDetailModal';
import ProductEditModal from '../ProductEditModal';
import ProductEditVariant from '../ProductEditVariants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './ProductRow.module.scss'

const cx = classNames.bind(styles);

export default function ProductRow({ row, initialOpen = false }) {
    const [open, setOpen] = useState(initialOpen);
    const [modalVisible, setModalVisible] = useState(false);
    const [modelEdit, setModelEdit] = useState(false);
    const [modalEditVariant, setmodalEditVariant] = useState(false);

    const handleShowModal = () => {
        setModalVisible(true);
    };

    const handleHideModal = () => {
        setModalVisible(false);
    };

    const handleShowModalEdit = () => {
        setModelEdit(true);
    };

    const handleHideModalEdit = () => {
        setModelEdit(false);
    };

    const handleShowModalEditVariant = () => {
        setmodalEditVariant(true);
    };

    const handleHideModalEditVaritant = () => {
        setmodalEditVariant(false);
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
                    <img className={cx('product-img')} alt={row.productName} src={row.images || ''} />
                </td>
                <th>{row.productName}</th>
                <td>{row.category_name}</td>
                <td>{row.subcategory_name}</td>
                <td>{formatDateTime(row.createdAt)}</td>
                <td>
                    <Button color="default" variant="dashed" onClick={handleShowModal} productID={row.id}>
                        <FontAwesomeIcon icon={faEye} style={{ color: 'blue' }}/>
                    </Button>

                    <Button color="default" variant="dashed" onClick={handleShowModalEdit} productID={row.id}>
                        <FontAwesomeIcon icon={faPenToSquare} style={{ color: 'green' }}/>
                    </Button>
                    <Button color="default" variant="dashed">
                        <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} /> 
                    </Button>
                </td>
            </tr>
            <tr>
                <td style={{ height: 0, padding: '0px 48px' }} colSpan={7}>
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
                                    '& > thead > tr > th:nth-child(n + 2), & > tbody > tr > td:nth-child(n + 3)': {
                                        textAlign: 'right', 
                                    },
                                    '& > thead > tr > th:nth-child(4), & > tbody > tr > td:nth-child(4)': {
                                        textAlign: 'left', 
                                    },
                                    
                                    '& > tbody > tr > td:nth-child(2), & > tbody > tr > td:nth-child(3)': {
                                        textAlign: 'right', 
                                    },
                                   
                                    '& > tbody > tr > td:nth-child(1), & > tbody > tr > td:nth-child(4)': {
                                        textAlign: 'left', 
                                    },
                                    '--TableCell-paddingX': '0.5rem',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Kích cỡ</th>
                                        <th>Giá (VND)</th>
                                        <th>Số lượng trong kho</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày cập nhật</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.variations.map((variation, index) => (
                                        <tr key={index}>
                                            <td>{variation.size || 'N/A'}</td>
                                            <td>{variation.price ? variation.price.toLocaleString() : 'N/A'}</td>
                                            <td>{variation.stock !== null ? variation.stock : 'N/A'}</td>
                                            <td>{variation.isDelete === 1 ? 'Còn kinh doanh' : 'Ngừng kinh doanh'}</td>
                                            <td>
                                                {variation.updatedAt
                                                    ? new Date(variation.updatedAt.replace(' ', 'T')).toLocaleString()
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr >
                                        <td style={{ textAlign: "center" }} colSpan={5}>
                                            <Button  
                                                type="primary" 
                                                onClick={handleShowModalEditVariant}
                                            >
                                                Chỉnh sửa chi tiết sản phẩm
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </td>
            </tr>
            <ProductDetailModal productID={row.product_id} open={modalVisible} onClose={handleHideModal} />
            <ProductEditModal productID={row.product_id} open={modelEdit} onClose={handleHideModalEdit} />
            <ProductEditVariant productID={row.product_id}  open={modalEditVariant} onClose={handleHideModalEditVaritant} />
        </>
    );
}
