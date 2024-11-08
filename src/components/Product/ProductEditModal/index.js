import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Row as AntRow, Col, Upload, Image } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import classNames from 'classnames/bind';
import style from './ProductEditMoal.module.scss';
import SummernoteEditor from '~/components/Summernote';
import { addImageAPI, fetchProductByIdAPI, removeImageAPI, updateProductAPI } from '~/apis/ProductAPI';

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
    const [variants, setVariants] = useState([]);
    const [productName, setProductName] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newFiles, setNewFiles] = useState([]);
    const [idImgDeleted, setIdImgDeleted] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

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

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        const uploadingFiles = newFileList.filter((file) => file.status === 'uploading');
        setNewFiles(uploadingFiles);
    };

    const handleRemoveImage = (file) => {
        setIdImgDeleted((prevIdImgDeleted) => [...prevIdImgDeleted, file.image_id]); // Cập nhật idImgDeleted đúng cách

        console.log('data', idImgDeleted);

        setFileList(fileList.filter((item) => item.image_id !== file.image_id));
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
                    const updatedFileList = data.images.map((image) => ({
                        uid: image.image_id,
                        name: `image-${image.image_id}`,
                        status: 'done',
                        url: image.image_url,
                        image_id: image.image_id,
                    }));
                    setFileList(updatedFileList);
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
            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('ProductID', productID || '');

                fileList.forEach((file) => {
                    console.log('File to upload log:', file.originFileObj);
                    formData.append('images', file.originFileObj);
                });

                await addImageAPI(formData);
                message.success('Cập nhật hình ảnh sản phẩm thành công!');
            }

            if (idImgDeleted.length > 0) {
                const deleteData = { ids: idImgDeleted };
                console.log('Data xóa:', deleteData);

                await removeImageAPI(deleteData);
                message.success('Xóa hình ảnh sản phẩm thành công!');
            }
        } catch (error) {
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
                        onRemove={handleRemoveImage}
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
                {variants.length > 0 ? ( // Kiểm tra nếu có ít nhất một biến thể
                    variants.map((variant, index) => (
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
                    ))
                ) : (
                    <p>No variants available</p> // Nếu không có biến thể nào, hiển thị thông báo
                )}

                <Button type="dashed" onClick={handleAddVariant} style={{ width: '100%', marginTop: '16px' }}>
                    Add Variant
                </Button>
            </div>

            {error && <p className={cx('error-message')}>{error}</p>}
        </Modal>
    );
}

export default ProductEditModal;
