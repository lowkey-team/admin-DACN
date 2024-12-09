import React from 'react';
import PropTypes from 'prop-types';
import { Button, TableRow, TableCell } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';

function SubcategoryRow({ sub, categoryName, onEditSubCategory, onDeleteSubCategory }) {
    const userPermissions = useSelector((state) => state.user.permissions);

    const canDeleteSubCategory = userPermissions.includes('Quản lý danh mục - Xóa danh mục con');
    const canEditSubCategory = userPermissions.includes('Quản lý danh mục - Sửa danh mục cona');

    return (
        <TableRow key={sub.id}>
            <TableCell>{sub.id}</TableCell>
            <TableCell component="th" scope="row">
                {sub.SupCategoryName}
            </TableCell>
            {canEditSubCategory && (
                <TableCell align="right">
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => onEditSubCategory(sub.id, sub.SupCategoryName)}
                    >
                        Sửa
                    </Button>
                    ,
                </TableCell>
            )}

            {canDeleteSubCategory && (
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
            )}
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
