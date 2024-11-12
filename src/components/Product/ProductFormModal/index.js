import React, { useState } from 'react';
import { Modal, Input, Button, Row as AntRow, Col, Upload, Image, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import classNames from 'classnames/bind';
import style from './ProductFromMoal.module.scss';
import SummernoteEditor from '~/components/Summernote';
import { AddProductAPI } from '~/apis/ProductAPI';

const cx = classNames.bind(style);

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function ProductFormModal({ open, onClose }) {
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [variants, setVariants] = useState([{ VariantName: '', Stock: '', Price: '', Discount: '' }]);
    const [productName, setProductName] = useState('');
    const [subCategory, setSubCategory] = useState('');

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleAddVariant = () => {
        setVariants([...variants, { VariantName: '', Stock: '', Price: '', Discount: '' }]);
    };

    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleAddProduct = async () => {
        const formData = new FormData();

        console.log('productName:', productName);
        console.log('subCategory:', subCategory);
        console.log('description:', content);

        formData.append('productName', productName || '');
        formData.append('ID_SupCategory', subCategory || '');
        formData.append('description', content || '');

        variants.forEach((variant, index) => {
            console.log(`Variant ${index}:`, variant);
            formData.append(`variants[${index}][VariantName]`, variant.VariantName || '');
            formData.append(`variants[${index}][Stock]`, variant.Stock || '');
            formData.append(`variants[${index}][Price]`, variant.Price || '');
        });

        fileList.forEach((file) => {
            console.log('File to upload:', file.originFileObj);
            formData.append('images', file.originFileObj);
        });

        // Ghi lại dữ liệu trong formData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await AddProductAPI(formData);
            message.success('Product added successfully');
            console.log('Product added successfully:', response.data);
            onClose();
        } catch (error) {
            console.error('Error adding product:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal
            title="Create Product"
            open={open}
            onOk={handleAddProduct}
            onCancel={onClose}
            okText="+ Add Product"
            cancelText="Cancel"
            className={cx('wrapper')}
            width={1100}
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
                                type="number"
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
                            <p>Variant name</p>
                            <Input
                                value={variant.VariantName}
                                onChange={(e) => handleVariantChange(index, 'VariantName', e.target.value)}
                                placeholder="Variant name"
                            />
                        </Col>
                        <Col span={5}>
                            <p>Stock</p>
                            <Input
                                value={variant.Stock}
                                onChange={(e) => handleVariantChange(index, 'Stock', e.target.value)}
                                placeholder="Stock"
                                type="number"
                                min={0}
                            />
                        </Col>
                        <Col span={5}>
                            <p>Price</p>
                            <Input
                                value={variant.Price}
                                onChange={(e) => handleVariantChange(index, 'Price', e.target.value)}
                                placeholder="Price"
                                type="number"
                                min={0}
                            />
                        </Col>
                        <Col span={2}>
                            <Button
                                type="dashed"
                                style={{ marginTop: '30px', color: 'red' }}
                                onClick={() => handleRemoveVariant(index)}
                                icon={<DeleteOutlined />}
                            />
                        </Col>
                    </AntRow>
                ))}
                <Button type="dashed" onClick={handleAddVariant} style={{ width: '100%', marginTop: '10px' }}>
                    <PlusOutlined /> Add Variant
                </Button>
            </div>
        </Modal>
    );
}

export default ProductFormModal;
