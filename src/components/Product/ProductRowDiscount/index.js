import React, { useEffect, useState } from 'react';
import IconButton from '@mui/joy/IconButton';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatDateTime } from '~/utils/dateUtils';
import classNames from 'classnames/bind';
import styles from './ProductRowDiscount.module.scss';

const cx = classNames.bind(styles);

export default function ProductRowDiscount({ row, initialOpen = false, onVariationSelect }) {
    const [open, setOpen] = useState(initialOpen);
    const [isProductChecked, setProductChecked] = useState(false);
    const [checkedVariations, setCheckedVariations] = useState(row.variations.map(() => false));

    useEffect(() => {
        const fetchData = async () => {
            console.log("row:", JSON.stringify(row, null, 2)); // Chuyển `row` thành JSON với định dạng đẹp (indent = 2 spaces)
        };
        fetchData();
    }, []);

    // Thay đổi trạng thái khi chọn hoặc bỏ chọn checkbox của sản phẩm
    const handleProductCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setProductChecked(isChecked);
        setCheckedVariations(row.variations.map(() => isChecked));
    };

    // Xử lý khi chọn hoặc bỏ chọn checkbox của biến thể sản phẩm
    const handleVariationCheckboxChange = (index) => (e) => {
        const isChecked = e.target.checked;
        const variation = row.variations[index];
    
        // Cập nhật mảng checkedVariations với trạng thái mới của biến thể
        setCheckedVariations((prevCheckedVariations) => {
            const newCheckedVariations = [...prevCheckedVariations]; // sao chép mảng cũ
            newCheckedVariations[index] = isChecked; // thay đổi trạng thái của phần tử hiện tại
            return newCheckedVariations;
        });
    
        // Nếu biến thể được chọn, gửi thông tin lên
        if (isChecked) {
            const variationId = String(variation.variation_id).trim();
            onVariationSelect(row.product_id, {
                variationId,
                size: variation.size,
                price: variation.price,
            });
        }
    
        // Kiểm tra xem tất cả các biến thể có được chọn không để cập nhật checkbox của sản phẩm
        setProductChecked((prevChecked) => {
            const allChecked = checkedVariations.every((checked) => checked); // kiểm tra tất cả các checkbox của biến thể
            return allChecked; // trả về trạng thái mới của checkbox sản phẩm
        });
    };

    
    

    return (
        <>
            <tr>
                <td>
                    <input
                        type="checkbox"
                        checked={isProductChecked}
                        onChange={handleProductCheckboxChange}
                    />
                </td>
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
                                    '--TableCell-paddingX': '0.5rem',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Kích cỡ</th>
                                        <th>Giá (VND)</th>
                                        <th>Số lượng trong kho</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày cập nhật</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.variations.map((variation, index) => (
                                        <tr key={variation.variation_id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={checkedVariations[index]}
                                                    onChange={handleVariationCheckboxChange(index)}
                                                />
                                            </td>
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
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </td>
            </tr>
        </>
    );
}
