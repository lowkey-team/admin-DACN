import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import Row from './Row'; // Import Row component
import {
    getAllCategoryAPI,
    addCategoryAPI,
    addSubCategoryAPI,
    updateCategoryAPI,
    deleteCategoryAPI,
    updateSubCategoryAPI,
    deleteSubCategoryAPI,
} from '~/apis/category';
import classNames from 'classnames/bind';
import style from './category.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { userSlice } from '~/redux/userSlice';

const cx = classNames.bind(style);
export default function CollapsibleTable() {
    const [categories, setCategories] = useState([]);
    const userPermissions = useSelector((state) => state.user.permissions);
    console.log('tenquyeen', userPermissions);
    const fetchCategories = async () => {
        try {
            const response = await getAllCategoryAPI();
            const transformedCategories = response.map((category) => ({
                ...category,
                subcategories: category.subcategories || [],
            }));
            setCategories(transformedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        const newCategoryName = prompt('Nhập tên danh mục mới');
        if (newCategoryName) {
            const newCategory = { categoryName: newCategoryName };
            try {
                const response = await addCategoryAPI(newCategory);
                fetchCategories();
                console.log(response);
            } catch (error) {
                console.error('Error adding category:', error);
            }
        }
    };

    const handleEditCategory = async (categoryId, categoryName) => {
        const newCategoryName = prompt('Sửa tên danh mục:', categoryName);
        console.log('Updating category:', categoryId);
        console.log('data name: ', newCategoryName);
        if (newCategoryName) {
            try {
                await updateCategoryAPI(categoryId, { categoryName: newCategoryName });
                fetchCategories();
            } catch (error) {
                console.error('Error updating category:', error);
            }
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
            try {
                await deleteCategoryAPI(categoryId);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleAddSubcategory = async (id) => {
        const newSubCategoryName = prompt('Nhập tên danh mục con');
        console.log('Adding category:', id);
        console.log('Adding category name:', newSubCategoryName);

        if (newSubCategoryName) {
            try {
                const newSubCategory = {
                    categoryId: id,
                    SupCategoryName: newSubCategoryName,
                };
                console.log('data subcategory: ' + newSubCategory);
                await addSubCategoryAPI(newSubCategory);
                fetchCategories();
            } catch (error) {
                console.error('Error adding subcategory:', error);
            }
        }
    };

    const handleEditSubCategory = async (subCategoryId, subCategoryName) => {
        const newSubCategoryName = prompt('Sửa tên danh mục con:', subCategoryName);
        console.log('Updating subcategory id:', subCategoryId);
        console.log('Updating subcategory name:', newSubCategoryName);
        if (newSubCategoryName) {
            try {
                await updateSubCategoryAPI(subCategoryId, { SupCategoryName: newSubCategoryName });
                fetchCategories();
            } catch (error) {
                console.error('Error updating subcategory:', error);
            }
        }
    };

    const handleDeleteSubCategory = async (subCategoryId) => {
        console.log('Deleting subcategory:', subCategoryId);
        if (window.confirm('Bạn có chắc muốn xóa danh mục con?')) {
            try {
                console.log('Deleting hhsubcategory:', subCategoryId);

                await deleteSubCategoryAPI(subCategoryId);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting subcategory:', error);
            }
        }
    };

    const canAddCategory = userPermissions.includes('Quản lý danh mục - Thêm danh mục cha');
    console.log('ẩn nut btn thêm dah mục cha:', canAddCategory);
    const canEditCategory = userPermissions.includes('Quản lý danh mục - Sửa danh mục cha');
    const canDeleteCategory = userPermissions.includes('Quản lý danh mục - Xóa danh mục cha');

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Tên danh mục</TableCell>
                        <TableCell align="right">
                            {canAddCategory && (
                                <Button size="small" variant="outlined" startIcon={<Add />} onClick={handleAddCategory}>
                                    Thêm danh mục
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((category) => (
                        <Row
                            key={category.category_id}
                            row={category}
                            onAddSubcategory={handleAddSubcategory}
                            onEditCategory={handleEditCategory}
                            onDeleteCategory={handleDeleteCategory}
                            onEditSubCategory={handleEditSubCategory}
                            onDeleteSubCategory={handleDeleteSubCategory}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
