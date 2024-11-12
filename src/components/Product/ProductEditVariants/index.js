import { Modal, Input, Button, Row as AntRow, Col, Upload, Image, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './ProductEditVariant.module.scss';
import { fetchProductByIdAPI } from '~/apis/ProductAPI';

const cx = classNames.bind(styles);

function ProductEditVariant({ open, onClose, productID }) {
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

                    console.log('variants data', variants);
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
    

    const handleAddVariant = () => {
        setVariants([...variants, { size: '', stock: '', price: '' }]);
    };
    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleStatusChange = (index, value) => {
        const newVariants = [...variants];
        newVariants[index].isDelete = value;
        setVariants(newVariants);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
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
            dataIndex: 'price',
            key: 'price',
            render: (_, record, index) => (
                <Input
                    value={record.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
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
            // onOk={handleUpdateProduct}
            onCancel={onClose}
            okText="Cập nhật"
            cancelText="Hủy"
            className={cx('wrapper')}
            width={1100}
           
            // confirmLoading={loading}
        >
       
        <Table
            columns={columns}
            dataSource={variants}
            rowKey={(record) => record.id || Math.random()}
            pagination={false}
            scroll={{ y: 400 }}
            // style={{ marginTop: '16px' }}
        />

        <Button type="dashed" onClick={handleAddVariant} style={{ width: '100%', marginTop: '16px' }}>
            Thêm chi tiết
        </Button>

        {error && <p className={cx('error-message')}>{error}</p>}
    </Modal>
     
    );
}

export default ProductEditVariant;