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
            title="Thêm sản phẩm mới"
            open={open}
            onOk={handleAddProduct}
            onCancel={onClose}
            okText="Thêm sản phẩm"
            cancelText="Hủy"
            className={cx('wrapper')}
            width={1100}
        >
            <AntRow gutter={16}>
                <Col span={16}>
                    <AntRow gutter={16}>
                        <Col className={cx('form-input')} span={24}>
                            <label>Tên sản phẩm</label>
                            <Input
                                placeholder="Tên sản phẩm"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </Col>
                        <Col className={cx('form-input')} span={12}>
                            <label>Danh mục</label>
                            <Input placeholder="Danh mục" />
                        </Col>
                        <Col className={cx('form-input')} span={12}>
                            <label>Danh mục con</label>
                            <Input
                                placeholder="Danh mục con"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                type="number"
                            />
                        </Col>
                        <Col className={cx('form-input', 'box-content')} span={24}>
                            <SummernoteEditor
                                className={cx('txt-description')}
                                content={content}
                                setContent={setContent}
                            />
                        </Col>
                    </AntRow>
                </Col>

                <Col className={cx('form-input')} span={8}>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        maxCount={8}
                    >
                        {fileList.length >= 8 ? null : (
                            <div className={cx('fileList-upload')}>
                                <PlusOutlined className={cx('plusoutline')} />
                                <div className={cx('upload-img')}>Tải ảnh lên</div>
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
                <p>Biến thể sản phẩm</p>
                {variants.map((variant, index) => (
                    <AntRow gutter={16} key={index} align="middle">
                        <Col className={cx('form-input')} span={7}>
                            <label>Tên biến thể</label>
                            <Input
                                value={variant.VariantName}
                                onChange={(e) => handleVariantChange(index, 'VariantName', e.target.value)}
                                placeholder="Tên biến thể"
                            />
                        </Col>
                        <Col className={cx('form-input')} span={5}>
                            <label>Số lượng</label>
                            <Input
                                value={variant.Stock}
                                onChange={(e) => handleVariantChange(index, 'Stock', e.target.value)}
                                placeholder="Số lượng"
                                type="number"
                                min={0}
                            />
                        </Col>
                        <Col className={cx('form-input')} span={5}>
                            <label>Giá</label>
                            <Input
                                value={variant.Price}
                                onChange={(e) => handleVariantChange(index, 'Price', e.target.value)}
                                placeholder="Giá"
                                type="number"
                                min={0}
                            />
                        </Col>
                        <Col className={cx('form-input')} span={2}>
                            <Button
                                type="dashed"
                                className={cx('btn-deleteVariant')}
                                onClick={() => handleRemoveVariant(index)}
                                icon={<DeleteOutlined />}
                            />
                        </Col>
                    </AntRow>
                ))}
                <Button type="dashed" onClick={handleAddVariant} className={cx('btn-addVariant')}>
                    <PlusOutlined /> Thêm biến thể
                </Button>
            </div>
        </Modal>
    );
}

export default ProductFormModal;
