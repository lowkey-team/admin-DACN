import { Modal, Input, Button, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './ProductEditVariant.module.scss';
import { fetchProductByIdAPI, updateVariationAPI, addVariationAPI } from '~/apis/ProductAPI';

const cx = classNames.bind(styles);

function ProductEditVariant({ open, onClose, productID }) {
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const [variants, setVariants] = useState([]);
    const [productName, setProductName] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [originalVariants, setOriginalVariants] = useState([]);

    useEffect(() => {
        console.log('ProductID', productID);
        const fetchData = async () => {
            if (open && productID) {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetchProductByIdAPI(productID);
                    setProductName(data.productName);
                    setSubCategory(data.subcategory_name);
                    setContent(data.description);

                    setVariants(
                        data.variations.map((v) => ({
                            id: v.variation_id,
                            size: v.size,
                            Price: parseInt(v.price),
                            stock: v.stock,
                            isDelete: v.isDelete,
                        })),
                    );
                    setOriginalVariants(data.variations);
                } catch (error) {
                    setError('Không thể tải chi tiết sản phẩm.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [open, productID]);

    const handleAddVariant = () => {
        setVariants([...variants, { size: '', stock: '', price: '' }]);
    };

    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        if (field === 'price' || field === 'stock') {
            const parsedValue = parseInt(value, 10);
            newVariants[index][field] = isNaN(parsedValue) ? 0 : parsedValue;
        } else {
            newVariants[index][field] = value;
        }
        setVariants(newVariants);
    };

    const handleUpdateProduct = async () => {
        setLoading(true);
        setError(null);

        try {
            const newVariants = variants
                .filter((variant) => !variant.id)
                .map(({ size, Price, stock }) => ({
                    ID_Product: productID,
                    size,
                    Price,
                    stock,
                }));

            const updatedVariants = variants.filter((variant, index) => {
                const original = originalVariants.find((orig) => orig.variation_id === variant.id);
                return (
                    original &&
                    (variant.size !== original.size ||
                        variant.Price !== original.price ||
                        variant.stock !== original.stock ||
                        variant.isDelete !== original.isDelete)
                );
            });

            // Kiểm tra nếu không có thay đổi
            if (newVariants.length === 0 && updatedVariants.length === 0) {
                setError('Không có thay đổi để cập nhật.');
                setLoading(false);
                return;
            }

            if (newVariants.length > 0) {
                console.log('Adding new variants:', newVariants);
                await addVariationAPI(newVariants);
            }

            if (updatedVariants.length > 0) {
                console.log('Updating variants:', updatedVariants);
                await updateVariationAPI(updatedVariants);
            }

            onClose();
        } catch (error) {
            console.error('Error updating product:', error);
            setError('Có lỗi xảy ra khi cập nhật chi tiết sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Mã số',
            dataIndex: 'id',
            key: 'id',
            render: (text) => text || '-',
        },
        {
            title: 'Kích thước',
            dataIndex: 'size',
            key: 'size',
            render: (_, record, index) => (
                <Input
                    value={record.size}
                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                    placeholder="Kích thước"
                />
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            render: (_, record, index) => (
                <Input
                    value={record.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                    placeholder="Số lượng tồn"
                    type="number"
                    min={0}
                />
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'Price',
            key: 'Price',
            render: (_, record, index) => (
                <Input
                    value={record.Price}
                    onChange={(e) => handleVariantChange(index, 'Price', e.target.value)}
                    placeholder="Giá"
                    type="number"
                    min={0}
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDelete',
            key: 'isDelete',
            render: (_, record, index) => (
                <Select
                    value={record.isDelete !== undefined ? record.isDelete : 0}
                    onChange={(value) => handleVariantChange(index, 'isDelete', value)}
                    style={{ width: '100%' }}
                >
                    <Select.Option value={1}>Ngừng kinh doanh</Select.Option>
                    <Select.Option value={0}>Còn kinh doanh</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Hoạt động',
            key: 'action',
            render: (_, record, index) =>
                !record.id && (
                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleRemoveVariant(index)} />
                ),
        },
    ];

    return (
        <Modal
            title="Cập nhật chi tiết sản phẩm"
            open={open}
            onOk={handleUpdateProduct}
            onCancel={onClose}
            okText="Cập nhật"
            cancelText="Hủy"
            className={cx('wrapper')}
            width={1100}
        >
            <Table
                columns={columns}
                dataSource={variants}
                rowKey={(record) => record.id || Math.random()}
                pagination={false}
                scroll={{ y: 400 }}
            />

            <Button type="dashed" onClick={handleAddVariant} style={{ width: '100%', marginTop: '16px' }}>
                Thêm chi tiết
            </Button>

            {error && <p className={cx('error-message')}>{error}</p>}
        </Modal>
    );
}

export default ProductEditVariant;
