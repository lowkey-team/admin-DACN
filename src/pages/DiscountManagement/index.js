import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import { Dropdown, Menu, Pagination } from 'antd';
import { DatePicker } from 'antd';

import ProductDiscountTable from '~/components/Product/ProductDiscountTable';
import ProductFilters from '~/components/Product/ProductFilters';
import { getAllDiscountAPI } from '~/apis/Discount';
import { fetchCategoryAPI, fetchProductAllAPI, fetchProductVariantsAPI } from '~/apis/ProductAPI';
import { AddDiscountVariantAPI } from '~/apis/DiscountVariant';
import styles from './DiscountManagement.module.scss';

const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;

function DiscountManagement() {
    const [inputValue, setInputValue] = useState(1);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);
    const [rows, setRows] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [subcategories, setSubcategories] = useState({});
    const [selectedVariations, setSelectedVariations] = useState([]); // Biến thể sản phẩm được chọn
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Lấy dữ liệu sản phẩm
    const fetchData = async () => {
        try {
            const data = await fetchProductAllAPI();
            setRows(data || []);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Lấy danh mục và subcategory
    const fetchCategoryData = async () => {
        try {
            const apiData = await fetchCategoryAPI();
            const categoryNames = apiData.map((category) => category.category_name);
            setCategories(categoryNames);

            const subcategoriesData = {};
            apiData.forEach((category) => {
                subcategoriesData[category.category_name] = category.subcategories.map((sub) => sub.SupCategoryName);
            });
            setSubcategories(subcategoriesData);
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);

    // Lấy các giảm giá
    const fetchDiscounts = async () => {
        try {
            const data = await getAllDiscountAPI();
            setDiscounts(data || []);
            if (data.length > 0) {
                setInputValue(data[0].discount);
                setSelectedDiscountId(data[0].id);
            }
        } catch (error) {
            console.error('Lỗi khi tải giảm giá:', error);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    // Xử lý khi người dùng chọn biến thể
    const handleVariationSelection = async (productId, variation) => {
        console.log('Product ID:', productId);
        console.log('Thông tin biến thể:', variation);

        // Lưu thông tin biến thể được chọn vào selectedVariations
        setSelectedVariations((prevVariations) => {
            const updatedVariations = [...prevVariations];
            const variationIndex = updatedVariations.findIndex((v) => v.variationId === variation.variationId);
            if (variationIndex === -1) {
                updatedVariations.push(variation);
            } else {
                updatedVariations.splice(variationIndex, 1); // Nếu biến thể đã chọn, bỏ chọn nó
            }
            return updatedVariations;
        });
    };

    // Xử lý khi xác nhận giảm giá
    const handleDiscountSubmit = async () => {
        if (!selectedDiscountId || selectedVariations.length === 0 || !startDate || !endDate) {
            alert('Vui lòng chọn đầy đủ thông tin.');
            return;
        }

        const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');

        // Gửi từng biến thể trong selectedVariations
        for (const variation of selectedVariations) {
            const formData = {
                ID_Variation: variation.variationId,
                ID_Discount: selectedDiscountId,
                StartDate: formattedStartDate,
                EndDate: formattedEndDate,
                status: 1,
            };
            console.log('Dữ liệu gửi đi: ', formData);

            try {
                const response = await AddDiscountVariantAPI(formData);
                console.log(`Giảm giá đã được áp dụng cho biến thể ${variation.variationId}:`, response.data);
                fetchData();
            } catch (error) {
                console.error('Lỗi khi áp dụng giảm giá cho biến thể', variation.variationId, error);
                alert('Có lỗi xảy ra khi áp dụng giảm giá');
                return;
            }
        }

        alert('Giảm giá đã được áp dụng cho các biến thể được chọn!');
    };

    const rangePresets = [
        { label: 'Trong 7 ngày', value: [dayjs().add(7, 'd'), dayjs()] },
        { label: 'Trong 14 ngày', value: [dayjs().add(14, 'd'), dayjs()] },
        { label: 'Trong 30 ngày', value: [dayjs().add(30, 'd'), dayjs()] },
        { label: 'Trong 90 ngày', value: [dayjs().add(90, 'd'), dayjs()] },
    ];

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            setStartDate(dates[0].toISOString());
            setEndDate(dates[1].toISOString());
        } else {
            console.log('Clear');
        }
    };

    // Lọc sản phẩm theo danh mục, subcategory và tìm kiếm
    const filteredProducts = useMemo(() => {
        return rows.filter((product) => {
            const matchesCategory =
                selectedCategories.length > 0 ? selectedCategories.includes(product.category_name) : true;
            const matchesSubcategory =
                selectedSubcategories.length > 0 ? selectedSubcategories.includes(product.subcategory_name) : true;
            const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSubcategory && matchesSearchTerm;
        });
    }, [rows, selectedCategories, selectedSubcategories, searchTerm]);

    const totalRows = filteredProducts.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

    const menu = (
        <Menu>
            {discounts.map((discount) => (
                <Menu.Item
                    key={discount.id}
                    onClick={() => {
                        setInputValue(discount.discount);
                        setSelectedDiscountId(discount.id);
                    }}
                >
                    Giảm giá {discount.discount}%
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div className={cx('wrapper', 'container')}>
            <div className={cx('row')}>
                <div className={cx('col-md-10', 'left-action')}>
                    <div className={cx('select-percent')}>
                        <label>Chọn % giảm giá:</label>
                        <Dropdown overlay={menu}>
                            <button className={cx('btn-selectDiscount')}>Giảm giá {inputValue}%</button>
                        </Dropdown>
                    </div>
                    <div className={cx('select-time')}>
                        <label>Chọn thời gian giảm giá:</label>
                        <RangePicker presets={rangePresets} onChange={onRangeChange} />
                    </div>
                </div>
                <div className={cx('col-md-2', 'right-action')}>
                    <div className={cx('btn-confirm')}>
                        <button onClick={handleDiscountSubmit}>Xác nhận</button>
                    </div>
                </div>
            </div>

            <div className={cx('row', 'row-filter')}>
                <div className={cx('col-md-12')}>
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
                </div>
            </div>

            <div className={cx('row', 'row-content')}>
                <div className={cx('col-md-12')}>
                    <ProductDiscountTable
                        currentRows={currentRows}
                        onVariationSelect={handleVariationSelection}
                        selectedVariations={selectedVariations}
                    />
                </div>
            </div>

            <Pagination
                current={currentPage}
                total={totalRows}
                pageSize={rowsPerPage}
                onChange={(page) => setCurrentPage(page)}
                style={{ marginTop: '16px', textAlign: 'right' }}
            />
        </div>
    );
}

export default DiscountManagement;
