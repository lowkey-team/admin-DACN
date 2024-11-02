import React, { useEffect, useState } from 'react';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Typography, Input, Row, Col, Select } from 'antd';
import { fecthPorductAPI } from '../../apis/ProductAPI';
import classNames from 'classnames/bind';
import style from './Product.module.scss';
import Button from '~/components/Button';
import { formatDateTime } from '~/utils/dateUtils';

const cx = classNames.bind(style);
const { Title } = Typography;
const { Option } = Select;

function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState({ name: 'asc', date: 'asc' }); // State cho sắp xếp

    const categories = ['Category 1', 'Category 2', 'Category 3'];
    const subcategories = {
        'Category 1': ['Subcategory 1-1', 'Subcategory 1-2'],
        'Category 2': ['Subcategory 2-1', 'Subcategory 2-2'],
        'Category 3': ['Subcategory 3-1', 'Subcategory 3-2'],
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fecthPorductAPI();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRemoveCategory = (categoryToRemove) => {
        setSelectedCategories((prevCategories) => prevCategories.filter((category) => category !== categoryToRemove));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Lọc sản phẩm theo danh mục và subcategory đã chọn
    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategories.length > 0 ? selectedCategories.includes(product.category_name) : true;
        const matchesSubcategory =
            selectedSubcategories.length > 0 ? selectedSubcategories.includes(product.subcategory_name) : true;
        const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSubcategory && matchesSearchTerm;
    });

    // Sắp xếp sản phẩm theo thứ tự
    const sortedProducts = filteredProducts.sort((a, b) => {
        // Sắp xếp theo tên
        if (a.productName < b.productName) return sortOrder.name === 'asc' ? -1 : 1;
        if (a.productName > b.productName) return sortOrder.name === 'asc' ? 1 : -1;

        // Nếu tên bằng nhau, sắp xếp theo ngày
        return sortOrder.date === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <>
            <Title level={1}>Product List</Title>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Input
                        placeholder="Search products"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col>
                    <Select
                        style={{ minWidth: 100 }}
                        mode="multiple"
                        placeholder="Categories"
                        value={selectedCategories}
                        onChange={(value) => setSelectedCategories(value)}
                        allowClear
                    >
                        {categories.map((category) => (
                            <Option key={category} value={category}>
                                {category}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Select
                        style={{ minWidth: 100 }}
                        mode="multiple"
                        placeholder="subcategories"
                        value={selectedSubcategories}
                        onChange={(value) => setSelectedSubcategories(value)}
                        allowClear
                    >
                        {Object.entries(subcategories).map(([category, subs]) =>
                            selectedCategories.includes(category)
                                ? subs.map((subcategory) => (
                                      <Option key={subcategory} value={subcategory}>
                                          {subcategory}
                                      </Option>
                                  ))
                                : null,
                        )}
                    </Select>
                </Col>
                <Col>
                    <Select
                        style={{ minWidth: 100 }}
                        placeholder="Sort by name"
                        value={sortOrder.name}
                        onChange={(value) => setSortOrder((prev) => ({ ...prev, name: value }))}
                        allowClear
                    >
                        <Option value="asc">Tên A-Z</Option>
                        <Option value="desc">Tên Z-A</Option>
                    </Select>
                </Col>
                <Col>
                    <Select
                        style={{ minWidth: 100 }}
                        placeholder="Sort by date"
                        value={sortOrder.date}
                        onChange={(value) => setSortOrder((prev) => ({ ...prev, date: value }))}
                        allowClear
                    >
                        <Option value="asc">asc</Option>
                        <Option value="desc">desc</Option>
                    </Select>
                </Col>
            </Row>
            <div className="container mt-3">
                <table className={classNames(cx('box-table'), 'table')}>
                    <thead className="table-primary">
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Product Name</th>
                            <th>Subcategory</th>
                            <th>Category</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map((product) => (
                            <tr key={product.product_id}>
                                <td>O</td>
                                <td className={cx('box-img_productItem')}>
                                    <img className={cx('img-product')} src={product.images} alt={product.productName} />
                                </td>
                                <td>{product.productName}</td>
                                <td>{product.subcategory_name}</td>
                                <td>{product.category_name}</td>
                                <td>{formatDateTime(product.createdAt)}</td>
                                <td>
                                    <Button edit onClick={() => alert('Edit product')}>
                                        <EyeOutlined /> detail
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Product;
