import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Row as AntRow, Col, Upload, Image, Select, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import classNames from 'classnames/bind';
import style from './ProductEditMoal.module.scss';
import SummernoteEditor from '~/components/Summernote';
import {
    addImageAPI,
    addVariationAPI,
    fetchProductByIdAPI,
    removeImageAPI,
    updateProductAPI,
    updateVariationAPI,
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
        setVariants([...variants, { size: '', stock: '', price: '' }]);
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
        setIdImgDeleted((prevIdImgDeleted) => [...prevIdImgDeleted, file.image_id]);

        console.log('data', idImgDeleted);

        setFileList(fileList.filter((item) => item.image_id !== file.image_id));
    };

    const handleStatusChange = (index, value) => {
        const newVariants = [...variants];
        newVariants[index].isDelete = value;
        setVariants(newVariants);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => text || '-',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (_, record, index) => (
                <Input
                    value={record.size}
                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                    placeholder="Variant Size"
                />
            ),
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (_, record, index) => (
                <Input
                    value={record.stock}
                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                    placeholder="Stock"
                    type="number"
                    min={0}
                />
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, record, index) => (
                <Input
                    value={record.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    placeholder="Price"
                    type="number"
                    min={0}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isDelete',
            key: 'isDelete',
            render: (_, record, index) =>
                record.id !== undefined ? (
                    <Select
                        value={record.isDelete !== undefined ? record.isDelete : 0} // Hiển thị giá trị hiện tại hoặc giá trị mặc định
                        onChange={(value) => handleVariantChange(index, 'isDelete', value)}
                        style={{ width: '100%' }}
                        loading={!record.isDelete && !record.id} // Hiển thị trạng thái loading khi cần
                    >
                        <Select.Option value={1}>Ngừng kinh doanh</Select.Option>
                        <Select.Option value={0}>Còn kinh doanh</Select.Option>
                    </Select>
                ) : null,
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record, index) =>
                !record.id && (
                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleRemoveVariant(index)} />
                ),
        },
    ];

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
                            id: v.variation_id,
                            size: v.size,
                            price: v.price,
                            stock: v.stock,
                        })),
                    );

                    console.log('variants dâtttatataatatat', variants);
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

        if (
            !productName ||
            !subCategory ||
            variants.some((variant) => !variant.size || !variant.stock || !variant.price)
        ) {
            message.error('Vui lòng điền đầy đủ thông tin trước khi cập nhật!');
            return;
        }
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

            const newVariants = variants.filter((variant) => !variant.id);
            const newVariantData = newVariants.map((variant) => ({
                ID_Product: productID,
                size: variant.size,
                Price: parseInt(variant.price),
                stock: parseInt(variant.stock),
            }));

            if (newVariantData.length > 0) {
                console.log('Variants để thêm:', newVariantData);
                await addVariationAPI(newVariantData);
                message.success('Thêm biến thể mới thành công!');
            }

            const updatedVariants = variants.map((variant) => ({
                ...variant,
                Price: parseInt(variant.price),
            }));

            console.log('Variants đã thay đổi:', updatedVariants);
            await updateVariationAPI(updatedVariants);
            message.success('Cập nhật biến thể thành công!');
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
                        multiple
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

            <Table
                columns={columns}
                dataSource={variants}
                rowKey={(record) => record.id || Math.random()}
                pagination={false}
                style={{ marginTop: '16px' }}
            />

            <Button type="dashed" onClick={handleAddVariant} style={{ width: '100%', marginTop: '16px' }}>
                Add Variant
            </Button>

            {error && <p className={cx('error-message')}>{error}</p>}
        </Modal>
    );
}

export default ProductEditModal;
