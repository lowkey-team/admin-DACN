import React, { useEffect, useState } from 'react';
import { Input, Button, Row as AntRow, Col, Upload, Image, message, Table, Cascader } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import SummernoteEditor from '~/components/Summernote';
import { AddProductAPI, fetchCategoryAPI } from '~/apis/ProductAPI';

import classNames from 'classnames/bind';

import styles from './AddMoreProduct.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AddMoreProduct() {
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [variants, setVariants] = useState([{ VariantName: '', Stock: '', Price: '', Discount: '' }]);
    const [productName, setProductName] = useState('');
    const [categories, setCategories] = useState([]);
    const handleDeleteRow = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    // Khởi tạo số dòng ban đầu cho bảng
    const [rows, setRows] = useState(
        Array.from({ length: 1 }, (_, index) => ({
            id: index + 1,
            name: '',
            category: '',
            subCategory: '',
            description: '',
            image: '',
            variant: '',
        })),
    );

    // Hàm xử lý thêm dòng mới
    const addRow = () => {
        setRows((prevRows) => [
            ...prevRows,
            {
                id: prevRows.length + 1,
                name: '',
                category: '',
                subCategory: '',
                description: '',
                image: '',
                variant: '',
            },
        ]);
    };

    // Hàm xử lý thay đổi giá trị trong ô nhập liệu
    const handleInputChange = (id, field, value) => {
        setRows((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    };

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

    useEffect(() => {
        const fetchData = async () => {
            const apiData = await fetchCategoryAPI();
            const categoryOptions = apiData.map((category) => ({
                value: category.category_name,
                label: category.category_name,
                children: category.subcategories.map((sub) => ({
                    value: sub.SupCategoryName,
                    label: sub.SupCategoryName,
                })),
            }));
            setCategories(categoryOptions);
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper', 'container')}>
            <div className={cx('title')}></div>
            <div className={cx('table-add')}>
                <table className={cx('table')}>
                    <thead className={cx('table-dark')}>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody border="1">
                        {rows.map((row) => (
                            <tr key={row.id} className={cx('row-add')}>
                                <td className={cx('row-add')}>
                                    <AntRow gutter={16} className={cx('col-input')}>
                                        <Col span={15}>
                                            <AntRow gutter={16}>
                                                <Col className={cx('form-input')} span={24}>
                                                    <label>Tên sản phẩm</label>
                                                    <Input
                                                        placeholder="Tên sản phẩm"
                                                        value={productName}
                                                        onChange={(e) => setProductName(e.target.value)}
                                                    />
                                                </Col>
                                                <Col className={cx('form-input')} span={24}>
                                                    <label>Danh mục & Danh mục con</label>
                                                    <Cascader
                                                        options={categories}
                                                        placeholder="Chọn danh mục"
                                                        onChange={(value) => {
                                                            handleInputChange(row.id, 'category', value[0] || '');
                                                            handleInputChange(row.id, 'subCategory', value[1] || '');
                                                        }}
                                                    />
                                                </Col>
                                                <Col className={cx('form-input', 'box-des')} span={24}>
                                                    <SummernoteEditor
                                                        className={cx('txt-description')}
                                                        content={content}
                                                        setContent={setContent}
                                                    />
                                                </Col>
                                            </AntRow>
                                        </Col>

                                        <Col className={cx('form-input')} span={9}>
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
                                        <h5>Biến thể sản phẩm</h5>
                                        {variants.map((variant, index) => (
                                            <AntRow
                                                gutter={16}
                                                key={index}
                                                align="middle"
                                                className={cx('row-variant')}
                                            >
                                                <Col className={cx('form-input')} span={7}>
                                                    <label>Tên biến thể</label>
                                                    <Input
                                                        value={variant.VariantName}
                                                        onChange={(e) =>
                                                            handleVariantChange(index, 'VariantName', e.target.value)
                                                        }
                                                        placeholder="Tên biến thể"
                                                    />
                                                </Col>
                                                <Col className={cx('form-input')} span={5}>
                                                    <label>Số lượng</label>
                                                    <Input
                                                        value={variant.Stock}
                                                        onChange={(e) =>
                                                            handleVariantChange(index, 'Stock', e.target.value)
                                                        }
                                                        placeholder="Số lượng"
                                                        type="number"
                                                        min={0}
                                                    />
                                                </Col>
                                                <Col className={cx('form-input')} span={5}>
                                                    <label>Giá</label>
                                                    <Input
                                                        value={variant.Price}
                                                        onChange={(e) =>
                                                            handleVariantChange(index, 'Price', e.target.value)
                                                        }
                                                        placeholder="Giá"
                                                        type="number"
                                                        min={0}
                                                    />
                                                </Col>
                                                <Col className={cx('btn__deleteRow-variant')} span={2}>
                                                    <Button
                                                        type="dashed"
                                                        className={cx('btn-deleteVariant')}
                                                        onClick={() => handleRemoveVariant(index)}
                                                        icon={<DeleteOutlined />}
                                                    />
                                                </Col>
                                            </AntRow>
                                        ))}
                                        <div className={cx('btn-addVariant')}>
                                            <Button type="dashed" onClick={handleAddVariant}>
                                                <PlusOutlined /> Thêm biến thể
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                                <td className={cx('btn_deleteRow')}>
                                    <button onClick={() => handleDeleteRow(row.id)}>Xóa dòng</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className={cx('btn__add-row')}>
                    <button onClick={addRow}>
                        Thêm dòng mới <FontAwesomeIcon icon={faAnglesDown} />
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AddMoreProduct;
