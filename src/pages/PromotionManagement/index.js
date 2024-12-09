    import classNames from "classnames/bind";
    import { Dropdown,  Menu,   Pagination } from 'antd';
    import { DatePicker } from 'antd';
    import dayjs from 'dayjs';
    import styles from './Promotion.module.scss';
    import { useEffect, useState, useMemo } from "react";
    import { getAllDiscountAPI } from "~/apis/Discount";
    import ProductDiscountTable from "~/components/Product/ProductDiscountTable";
    import ProductFilters from "~/components/Product/ProductFilters";
    import { fetchCategoryAPI, fetchProductAllAPI } from "~/apis/ProductAPI";
    import { AddDiscountVariantAPI } from "~/apis/DiscountVariant";

    const cx = classNames.bind(styles);
    const { RangePicker } = DatePicker;

    function PromotionManagement() {
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
        const [selectedVariations, setSelectedVariations] = useState([]);
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);

        // Hàm xử lý khi chọn biến thể
        const handleVariationSelection = async (productId, variation) => {
            console.log("Product ID:", productId);
            console.log("Thông tin biến thể:", variation);
        
            setSelectedVariations(variation); 

            const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
            const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");

            const formData = {
                ID_Variation: variation.variationId, 
                ID_Discount: selectedDiscountId,
                StartDate: formattedStartDate,
                EndDate: formattedEndDate,
                status: 1
            };

            try {
                const response = await AddDiscountVariantAPI(formData);
                console.log("Giảm giá đã được áp dụng thành công", response.data);
                alert("Giảm giá đã được áp dụng thành công");
            } catch (error) {
                console.error("Lỗi khi áp dụng giảm giá", error);
                alert("Có lỗi xảy ra khi áp dụng giảm giá");
            }
       
        };

        const handleDiscountSubmit = async () => {
            if (!selectedDiscountId || selectedVariations.length === 0 || !startDate || !endDate) {
                alert("Vui lòng chọn đầy đủ thông tin.");
                console.log('id % giảm:', selectedDiscountId);
                console.log('Biến thể đã chọn:', selectedVariations);
                console.log('Ngày bắt đầu:', startDate);
                console.log('Ngày kết thúc:', endDate);
                return;
            }
        
            const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
            const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
        
            const formData = {
                ID_Variation: selectedVariations.variation_id, 
                ID_Discount: selectedDiscountId,
                StartDate: formattedStartDate,
                EndDate: formattedEndDate,
                status: 1
            };
        
            console.log("Dữ liệu gửi đi: ", formData);
        
            try {
                const response = await AddDiscountVariantAPI(formData);
                console.log("Giảm giá đã được áp dụng thành công", response.data);
                alert("Giảm giá đã được áp dụng thành công");
            } catch (error) {
                console.error("Lỗi khi áp dụng giảm giá", error);
                alert("Có lỗi xảy ra khi áp dụng giảm giá");
            }
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
                console.log('From: ', dates[0], ', to: ', dates[1]);
                console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            } else {
                console.log('Clear');
            }
        };

        const fetchData = async () => {
            try {
                const data = await fetchProductAllAPI();
                setRows(data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };

        useEffect(() => {
            fetchData();
        }, []);

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
                console.error("Lỗi khi tải danh mục:", error);
            }
        };

        useEffect(() => {
            fetchCategoryData();
        }, []);

        const fetchDiscounts = async () => {
            try {
                const data = await getAllDiscountAPI();
                setDiscounts(data || []); 
                if (data.length > 0) {
                    setInputValue(data[0].discount);
                    setSelectedDiscountId(data[0].id);
                }
            } catch (error) {
                console.error("Lỗi khi tải giảm giá:", error);
            }
        };

        useEffect(() => {
            fetchDiscounts();
        }, []);

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
                            console.log(`Discount đã chọn: ${discount.discount}%`);
                            console.log('id của discount đã chọn: ', discount.id);
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
                                <button className={cx('btn-selectDiscount')}>
                                    Giảm giá {inputValue}%
                                </button>
                            </Dropdown>
                        </div>

                        <div className={cx('select-time')}>
                            <label>Chọn thời gian giảm giá:</label>
                            <RangePicker presets={rangePresets} onChange={onRangeChange} />
                        </div>
                    </div>

                    {/* <div className={cx('col-md-2', 'right-action')}>
                        <div className={cx('btn-confirm')}>
                            <button onClick={handleDiscountSubmit}>Xác nhận</button>
                        </div>
                    </div> */}
                </div>

                <div className={cx('row','row-filter')}>
                    <div className={cx('col-md-12', )}>
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

    export default PromotionManagement;
