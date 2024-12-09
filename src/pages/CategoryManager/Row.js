import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Collapse,
    IconButton,
    TableRow,
    TableCell,
    Button,
    Typography,
    Table,
    TableHead,
    TableBody,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Edit, Delete } from '@mui/icons-material';
import SubcategoryRow from './SubcategoryRow';
import { Add } from '@mui/icons-material';

import classNames from 'classnames/bind';
import style from './category.module.scss';
import { useSelector } from 'react-redux';

const cx = classNames.bind(style);

function Row({ row, onAddSubcategory, onEditCategory, onDeleteCategory, onEditSubCategory, onDeleteSubCategory }) {
    const [open, setOpen] = useState(false);
    const userPermissions = useSelector((state) => state.user.permissions);

    const canEditCategory = userPermissions.includes('Quản lý danh mục - Sửa danh mục cha');
    const canDeleteCategory = userPermissions.includes('Quản lý danh mục - Xóa danh mục cha');
    const canAddSubCategory = userPermissions.includes('Quản lý danh mục - Thêm danh mục con');

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.category_id}</TableCell>

                <TableCell component="th" scope="row">
                    {row.category_name}
                </TableCell>
                <TableCell align="right" className={cx('box-row')}>
                    {canAddSubCategory && (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => onAddSubcategory(row.category_id)} // Sử dụng id khi thêm danh mục con
                        >
                            Thêm con
                        </Button>
                    )}

                    {canEditCategory && (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => onEditCategory(row.category_id, row.category_name)} // Sử dụng id khi sửa
                        >
                            Sửa
                        </Button>
                    )}

                    {canDeleteCategory && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => onDeleteCategory(row.category_id)} // Sử dụng id khi xóa
                        >
                            Xóa
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                Danh mục con
                            </Typography>
                            <Table size="small" aria-label="subcategories">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell> {/* Cột ID danh mục con */}
                                        <TableCell>Tên danh mục con</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.subcategories.map((sub) => (
                                        <SubcategoryRow
                                            key={sub.id}
                                            sub={sub}
                                            categoryId={row.id}
                                            onEditSubCategory={onEditSubCategory}
                                            onDeleteSubCategory={onDeleteSubCategory}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        category_id: PropTypes.string.isRequired,
        category_name: PropTypes.string.isRequired,
        subcategories: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                SupCategoryName: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
    onAddSubcategory: PropTypes.func.isRequired,
    onEditCategory: PropTypes.func.isRequired,
    onDeleteCategory: PropTypes.func.isRequired,
    onEditSubCategory: PropTypes.func.isRequired,
    onDeleteSubCategory: PropTypes.func.isRequired,
};

export default Row;
