import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Row as AntRow, Col, Upload, Image, Cascader, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import style from './ProductEditMoal.module.scss';
import SummernoteEditor from '~/components/Summernote';
import {
    addImageAPI,
    fetchCategoryAPI,
    fetchProductByIdAPI,
    removeImageAPI,
    updateProductAPI,
} from '~/apis/ProductAPI';

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
    const [productName, setProductName] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategoryID, setSubCategoryID] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [idImgDeleted, setIdImgDeleted] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (open && productID) {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetchProductByIdAPI(productID);
                    setProductName(data.productName);
                    setSubCategoryID(data.subcategory_id);
                    setSubCategoryName(data.subcategory_name);
                    setContent(data.description);
                    setFileList(
                        data.images.map((image) => ({
                            uid: image.image_id,
                            name: `image-${image.image_id}`,
                            status: 'done',
                            url: image.image_url,
                            image_id: image.image_id,
                        })),
                    );
                } catch (error) {
                    console.error('Lỗi khi tải chi tiết sản phẩm:', error);
                    setError('Không thể tải chi tiết sản phẩm.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProductDetails();
    }, [open, productID]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiData = await fetchCategoryAPI();
                const categoryOptions = apiData.map((category) => ({
                    value: category.category_name,
                    label: category.category_name,
                    children: category.subcategories.map((sub) => ({
                        value: sub.id,
                        label: sub.SupCategoryName,
                    })),
                }));
                setCategories(categoryOptions);
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleRemoveImage = (file) => {
        setIdImgDeleted((prev) => [...prev, file.image_id]);
        setFileList(fileList.filter((item) => item.image_id !== file.image_id));
    };

    const handleUpdateProduct = async () => {
        if (!productName || !subCategoryID) {
            message.error('Vui lòng điền đầy đủ thông tin trước khi cập nhật!');
            return;
        }

        setLoading(true);
        try {
            // Xóa hình ảnh
            if (idImgDeleted.length > 0) {
                await removeImageAPI({ ids: idImgDeleted });
                message.success('Xóa hình ảnh thành công!');
            }

            // Thêm hình ảnh mới
            const formData = new FormData();
            formData.append('ProductID', productID);
            fileList
                .filter((file) => file.originFileObj)
                .forEach((file) => formData.append('images', file.originFileObj));
            if (formData.has('images')) {
                await addImageAPI(formData);
                message.success('Cập nhật hình ảnh thành công!');
            }

            const productData = {
                ID_SupCategory: subCategoryID,
                productName: productName,
                description: content,
            };
            console.log('data id', productID);
            console.log('dât form', productData);

            await updateProductAPI(productID, productData);

            message.success('Cập nhật sản phẩm thành công!');
        } catch (error) {
            message.error('Cập nhật sản phẩm thất bại.');
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Cập nhật thông tin sản phẩm"
            open={open}
            onOk={handleUpdateProduct}
            onCancel={onClose}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={loading}
            className={cx('wrapper')}
            width={1100}
        >
            <AntRow gutter={16}>
                <Col span={16}>
                    <AntRow gutter={16}>
                        <Col span={24}>
                            <label>Tên sản phẩm</label>
                            <Input
                                placeholder="Tên sản phẩm"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </Col>
                        <Col span={24}>
                            <label>Danh mục</label>
                            <Cascader
                                className={cx('cascader-custom')}
                                options={categories}
                                value={subCategoryName ? [subCategoryName] : []}
                                placeholder="Chọn danh mục"
                                onChange={(value, selectedOptions) => {
                                    setSubCategoryID(value[1] || '');
                                    setSubCategoryName(selectedOptions[1]?.label || '');
                                }}
                            />
                        </Col>
                        <Col span={24}>
                            <SummernoteEditor content={content} setContent={setContent} />
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
                        multiple
                    >
                        {fileList.length < 8 && (
                            <div>
                                <PlusOutlined />
                                <div>Upload</div>
                            </div>
                        )}
                    </Upload>
                    <Image
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                        }}
                        src={previewImage}
                        style={{ display: 'none' }}
                    />
                </Col>
            </AntRow>
            {error && <p className={cx('error-message')}>{error}</p>}
        </Modal>
    );
}

export default ProductEditModal;
