import React from 'react';
import PropTypes from 'prop-types';
import { Button, TableRow, TableCell } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function SubcategoryRow({ sub, categoryName, onEditSubCategory, onDeleteSubCategory }) {
    return (
        <TableRow key={sub.id}>
            {/* Hiển thị ID của danh mục con */}
            <TableCell>{sub.id}</TableCell>
            <TableCell component="th" scope="row">
                {sub.SupCategoryName}
            </TableCell>
            <TableCell align="right">
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => onEditSubCategory(sub.id, sub.SupCategoryName)}
                >
                    Sửa
                </Button>
            </TableCell>
            <TableCell align="right">
                <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onDeleteSubCategory(sub.id)}
                >
                    Xóa
                </Button>
            </TableCell>
        </TableRow>
    );
}

SubcategoryRow.propTypes = {
    sub: PropTypes.shape({
        id: PropTypes.string.isRequired,
        SupCategoryName: PropTypes.string.isRequired,
    }).isRequired,
    categoryName: PropTypes.string.isRequired,
    onEditSubCategory: PropTypes.func.isRequired,
    onDeleteSubCategory: PropTypes.func.isRequired,
};

export default SubcategoryRow;
