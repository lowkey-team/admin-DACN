import React, { useEffect, useState } from 'react';
import { Layout, Button, Typography, Select, Form, notification, Input, List, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Warehouse.module.scss';
import { getAllCategoryAPI } from '~/apis/category';
import { fetchProductByIdAPI, fetchProductByIdSupCategoryAPI } from '~/apis/ProductAPI';

const cx = classNames.bind(styles);

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

function WarehouseCreate() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productID, setProductID] = useState(null);

    const [error, setError] = useState(null);
    const [variants, setVariants] = useState([]);
    const [originalVariants, setOriginalVariants] = useState([]);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [importedProducts, setImportedProducts] = useState([]);

    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('warehouseProducts')) || [];
        console.log('data session:', storedProducts);
        setImportedProducts(storedProducts);
    }, []);
    const [productInfo, setProductInfo] = useState({
        productName: '',
        productImage: '',
    });

    const [variantInfo, setVariantInfo] = useState({
        variantName: '',
        variantCode: '',
        stockQuantity: 0,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await getAllCategoryAPI();
                if (response) {
                    setCategories(response);
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể lấy danh sách danh mục.',
                    });
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: error.message || 'Đã xảy ra lỗi khi gọi API.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        console.log('ProductID:', productID);
        const fetchData = async () => {
            if (productID) {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetchProductByIdAPI(productID);
                    console.log('data variation', data);

                    setVariants(
                        data.variations.map((v) => ({
                            id: v.variation_id,
                            size: v.size,
                            price: parseInt(v.price),
                            stock: v.stock,
                            isDelete: v.isDelete,
                        })),
                    );
                    console.log('data validation map', data.variations);
                    setOriginalVariants(data.variations);
                } catch (error) {
                    setError('Không thể tải chi tiết sản phẩm.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [productID]);

    const handleCategoryChange = (categoryId) => {
        const selectedCategory = categories.find((category) => category.category_id === categoryId);
        console.log('Danh mục được chọn:', selectedCategory);

        setSubcategories(selectedCategory?.subcategories || []);
    };

    const handleSubcategoryChange = async (subcategoryId) => {
        console.log('lay id:', subcategoryId);
        const productsData = await fetchProductByIdSupCategoryAPI(subcategoryId);
        console.log('Danh sách sản phẩm:', productsData);
        if (productsData) {
            setProducts(productsData);
        }
    };

    const handleImportStock = () => {
        if (!variantInfo.variantCode) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng chọn biến thể sản phẩm!',
            });
            return;
        }

        if (quantity <= 0) {
            notification.error({
                message: 'Lỗi',
                description: 'Số lượng nhập kho phải lớn hơn 0!',
            });
            return;
        }

        const importedProduct = {
            productName: productInfo.productName,
            productImage: productInfo.productImage,
            variantName: variantInfo.variantName,
            variantCode: variantInfo.variantCode,
            quantity: quantity,
        };
        console.log('data ne:', importedProduct);

        const storedProducts = JSON.parse(localStorage.getItem('warehouseProducts')) || [];

        const existingProductIndex = storedProducts.findIndex(
            (product) => product.variantCode === variantInfo.variantCode,
        );

        if (existingProductIndex !== -1) {
            storedProducts[existingProductIndex].quantity =
                parseInt(storedProducts[existingProductIndex].quantity, 10) + parseInt(quantity, 10);
        } else {
            storedProducts.push(importedProduct);
        }

        localStorage.setItem('warehouseProducts', JSON.stringify(storedProducts));
        setImportedProducts(storedProducts);
        notification.success({
            message: 'Thành công',
            description: 'Nhập kho thành công!',
        });
    };

    const handleVariantChange = (variantId) => {
        const selected = variants.find((variant) => variant.id === variantId);
        setSelectedVariant(selected);
        setVariantInfo({
            variantName: selected.size,
            variantCode: selected.id,
        });
    };

    const handleProductChange = async (productId) => {
        setProductID(productId);
        const selectedProduct = products.find((product) => product.id === productId);
        setProductInfo({
            productName: selectedProduct.productName,
            productImage: selectedProduct.IMG_URL,
        });
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setQuantity(value);
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const handleQuantityUpdate = (e, record) => {
        const newQuantity = e.target.value;
        const updatedProducts = importedProducts.map((product) =>
            product.productName === record.productName ? { ...product, quantity: newQuantity } : product,
        );
        setImportedProducts(updatedProducts);
        localStorage.setItem('warehouseProducts', JSON.stringify(updatedProducts));
    };

    const handleDeleteProduct = (record) => {
        const updatedProducts = importedProducts.filter((product) => product.productName !== record.productName);
        setImportedProducts(updatedProducts);
        localStorage.setItem('warehouseProducts', JSON.stringify(updatedProducts));
    };

    return (
        <Layout className={cx('container')}>
            <Content className={cx('content')}>
                <div className={cx('header')}>
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleGoBack}
                        className={cx('back-button')}
                    >
                        Quay lại
                    </Button>
                    <div className={cx('title')}>
                        <Title level={4}>Tạo phiếu nhập kho</Title>
                    </div>
                </div>
                <div className={cx('body')}>
                    <Form layout="vertical" className={cx('form')}>
                        {/* Select danh mục cha */}
                        <Form.Item
                            label="Danh mục"
                            name="category"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select
                                placeholder="Chọn danh mục"
                                loading={loading}
                                onChange={handleCategoryChange} // Gọi khi danh mục cha thay đổi
                            >
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <Option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled>Không có danh mục nào</Option>
                                )}
                            </Select>
                        </Form.Item>

                        {/* Select danh mục con */}
                        <Form.Item
                            label="Danh mục con"
                            name="subcategory"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục con!' }]}
                        >
                            <Select
                                placeholder="Chọn danh mục con"
                                disabled={subcategories.length === 0}
                                onChange={handleSubcategoryChange}
                            >
                                {subcategories.length > 0 ? (
                                    subcategories.map((subcategory) => (
                                        <Option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.SupCategoryName}
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled>Không có danh mục con</Option>
                                )}
                            </Select>
                        </Form.Item>

                        {/* Hiển thị sản phẩm với tìm kiếm */}
                        <Form.Item
                            label="Sản phẩm"
                            name="product"
                            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Tìm sản phẩm"
                                filterOption={(input, option) => {
                                    const productName = option?.children?.props?.children[1] || '';
                                    return productName.toLowerCase().includes(input.toLowerCase());
                                }}
                                onChange={handleProductChange}
                                notFoundContent="Không tìm thấy sản phẩm"
                            >
                                {products.map((product) => (
                                    <Option key={product.id} value={product.id}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={product.IMG_URL}
                                                alt={product.productName}
                                                style={{ width: 30, height: 30, marginRight: 10 }}
                                            />
                                            {product.productName}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Hiển thị biến thể */}
                        <Form.Item
                            label="Biến thể sản phẩm"
                            name="variant"
                            rules={[{ required: true, message: 'Vui lòng chọn biến thể!' }]}
                        >
                            <Select placeholder="Chọn biến thể" onChange={handleVariantChange}>
                                {variants.map((variant) => (
                                    <Option key={variant.id} value={variant.id}>
                                        {`Kích Thước: ${variant.size} -  Số lượng tồn kho: ${variant.stock}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Hiển thị thông tin nhập kho */}
                        <Form.Item label="Số lượng nhập kho" name="quantity">
                            <Input type="number" value={quantity} onChange={handleQuantityChange} min={1} />
                        </Form.Item>
                    </Form>
                    <Button type="primary" onClick={handleImportStock}>
                        Nhập kho
                    </Button>

                    {/* Hiển thị danh sách sản phẩm nhập kho */}
                    <div className={cx('imported-products')}>
                        <Title level={5}>Danh sách sản phẩm nhập kho</Title>
                        <Table
                            dataSource={importedProducts}
                            rowKey="variantCode"
                            columns={[
                                {
                                    title: 'Hình ảnh',
                                    dataIndex: 'productImage',
                                    key: 'productImage',
                                    render: (text) => (
                                        <img
                                            src={text}
                                            alt="Product"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    ),
                                },
                                {
                                    title: 'Tên sản phẩm',
                                    dataIndex: 'productName',
                                    key: 'productName',
                                },
                                {
                                    title: 'Biến thể',
                                    dataIndex: 'variantName',
                                    key: 'variantName',
                                },
                                {
                                    title: 'Mã biến thể',
                                    dataIndex: 'variantCode',
                                    key: 'variantCode',
                                },
                                {
                                    title: 'Số lượng nhập kho',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    render: (text, record) => (
                                        <Input
                                            type="number"
                                            value={text}
                                            min={1}
                                            onChange={(e) => handleQuantityUpdate(e, record)}
                                        />
                                    ),
                                },
                                {
                                    title: 'Hành động',
                                    key: 'action',
                                    render: (text, record) => (
                                        <Button
                                            type="danger"
                                            icon={<ArrowLeftOutlined />}
                                            onClick={() => handleDeleteProduct(record)}
                                        >
                                            Xóa
                                        </Button>
                                    ),
                                },
                            ]}
                            rowKey="productName"
                        />
                    </div>
                </div>
            </Content>
        </Layout>
    );
}

export default WarehouseCreate;
