import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Row as AntRow, Col, Upload, Image } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import axios from 'axios';
import classNames from 'classnames/bind';
import style from './ProductEditMoal.module.scss';
import SummernoteEditor from '~/components/Summernote';
import { AddProductAPI, fetchProductByIdAPI, updateProductAPI } from '~/apis/ProductAPI';

const cx = classNames.bind(style);
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ProductEditModal({ open, onClose, productID }) {
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [variants, setVariants] = useState([{ size: '', price: '', stock: '', discount: '' }]);
    const [productName, setProductName] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState(null);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleAddVariant = () => {
        setVariants([...variants, { size: '', stock: '', price: '', discount: '' }]);
    };

    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (open && productID) {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetchProductByIdAPI(productID);
                    console.log(data);
                    setProductName(data.productName);
                    setSubCategory(data.subcategory_name);
                    setContent(data.description);
                    setFileList(
                        Array.isArray(data.images) ? data.images.map((image) => ({ url: image.image_url })) : [],
                    );
                    setVariants(
                        data.variations.map((v) => ({
                            size: v.size,
                            price: v.price,
                            stock: v.stock,
                            discount: v.discount,
                        })),
                    );
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
                    setError('Không thể tải chi tiết sản phẩm.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [open, productID]);

    const handleUpdateProduct = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('subCategory', subCategory);
            formData.append('description', content);

            fileList.forEach((file) => {
                formData.append('images', file.originFileObj);
            });
            console.log('Dữ liệu sản phẩm sắp cập nhật:', {
                productName,
                subCategory,
                description: content,
                images: fileList.map((file) => file.originFileObj),
                variants,
            });

            await updateProductAPI(productID, formData);
            message.success('Cập nhật sản phẩm thành công!');
            onClose(); // Đóng modal sau khi cập nhật
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error.response ? error.response.data : error.message);
            message.error('Cập nhật sản phẩm không thành công.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Update Product"
            open={open}
            onOk={handleUpdateProduct}
            onCancel={onClose}
            okText="Update Product"
            cancelText="Cancel"
            className={cx('wrapper')}
            width={1100}
            confirmLoading={loading}
        >
            <AntRow gutter={16}>
                <Col span={16}>
                    <AntRow gutter={16}>
                        <Col span={24}>
                            <p>Product name</p>
                            <Input
                                placeholder="Product Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </Col>
                        <Col span={12}>
                            <p>Category</p>
                            <Input placeholder="Category" />
                        </Col>
                        <Col span={12}>
                            <p>Sub Category</p>
                            <Input
                                placeholder="Sub Category"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                            />
                        </Col>
                        <Col span={24} className={cx('box-content')}>
                            <SummernoteEditor
                                className={cx('txt-description')}
                                content={content}
                                setContent={setContent}
                            />
                        </Col>
                    </AntRow>
                </Col>

                <Col span={8}>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        maxCount={8}
                    >
                        {fileList.length >= 8 ? null : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PlusOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                <div style={{ marginTop: 8, color: '#1890ff' }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </Col>
            </AntRow>

            <div className={cx('variant-section')}>
                <p>Product Variants</p>
                {variants.map((variant, index) => (
                    <AntRow gutter={16} key={index} align="middle">
                        <Col span={7}>
                            <p>Variant Size</p>
                            <Input
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                placeholder="Variant Size"
                            />
                        </Col>
                        <Col span={5}>
                            <p>Stock</p>
                            <Input
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                placeholder="Stock"
                                type="number"
                                min={0}
                            />
                        </Col>
                        <Col span={5}>
                            <p>Price</p>
                            <Input
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                placeholder="Price"
                                type="number"
                                min={0}
                            />
                        </Col>
                        <Col span={5}>
                            <p>Discount (%)</p>
                            <Input
                                value={variant.discount}
                                onChange={(e) => handleVariantChange(index, 'discount', e.target.value)}
                                placeholder="Discount"
                                type="number"
                                min={0}
                            />
                        </Col>
                        <Col span={2}>
                            <Button
                                type="danger"
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveVariant(index)}
                                style={{ marginTop: '24px' }}
                            />
                        </Col>
                    </AntRow>
                ))}
                <Button type="dashed" onClick={handleAddVariant} style={{ width: '100%', marginTop: '16px' }}>
                    Add Variant
                </Button>
            </div>
            {error && <p className={cx('error-message')}>{error}</p>}
        </Modal>
    );
}

export default ProductEditModal;
