// TableCollapsibleRow.js
import React, { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { fetchProductAllAPI, fetchCategoryAPI } from '~/apis/ProductAPI';
import ProductFilters from '~/components/Product/ProductFilters';
import ProductTable from '~/components/Product/ProductTable';

export default function TableCollapsibleRow() {
    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchProductAllAPI();
            setRows(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const apiData = await fetchCategoryAPI();
            const categoryNames = apiData.map((category) => category.category_name);
            setCategories(categoryNames);

            const subcategoriesData = {};
            apiData.forEach((category) => {
                subcategoriesData[category.category_name] = category.subcategories.map((sub) => sub.SupCategoryName);
            });
            setSubcategories(subcategoriesData);
        };
        fetchData();
    }, []);

    const filteredProducts = rows.filter((product) => {
        const matchesCategory =
            selectedCategories.length > 0 ? selectedCategories.includes(product.category_name) : true;
        const matchesSubcategory =
            selectedSubcategories.length > 0 ? selectedSubcategories.includes(product.subcategory_name) : true;
        const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSubcategory && matchesSearchTerm;
    });

    const totalRows = filteredProducts.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                subcategories={subcategories}
                selectedSubcategories={selectedSubcategories}
                setSelectedSubcategories={setSelectedSubcategories}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
            />
            <ProductTable currentRows={currentRows} />
            <Pagination
                current={currentPage}
                total={totalRows}
                pageSize={rowsPerPage}
                onChange={(page) => setCurrentPage(page)}
                style={{ marginTop: '16px', textAlign: 'right' }}
            />
        </>
    );
}
