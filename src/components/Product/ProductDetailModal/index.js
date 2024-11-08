import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchProductByIdAPI } from '~/apis/ProductAPI';
import classNames from 'classnames/bind';

import styles from './ProductDetailMoal.module.scss';

const cx = classNames.bind(styles);

function ProductDetailModal({ productID, open, onClose }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productDetails && productDetails.images && productDetails.images.length > 0) {
            setSelectedImage(productDetails.images[0]);
            setSelectedVariant(productDetails.variations[0]); // Chọn biến thể đầu tiên làm mặc định
        }
    }, [productDetails]);

    useEffect(() => {
        const fetchData = async () => {
            if (open && productID) {
                setLoading(true);
                setError(null); // Đặt lại lỗi trước khi tải dữ liệu
                try {
                    const data = await fetchProductByIdAPI(productID);
                    setProductDetails(data);
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
                    setError('Không thể tải chi tiết sản phẩm.'); // Cập nhật trạng thái lỗi
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [open, productID]);

    const adjustQuantity = (adjustment) => {
        const newQuantity = quantity + adjustment;
        if (newQuantity >= 1 && (!selectedVariant || newQuantity <= selectedVariant.stock)) {
            setQuantity(newQuantity);
        }
    };

    const handleInputChange = (e) => {
        const value = Math.max(1, Math.min(selectedVariant?.stock || 1, parseInt(e.target.value, 10) || 1));
        setQuantity(value);
    };

    const handleBlur = () => {
        if (quantity < 1) setQuantity(1);
    };

    const handleSizeClick = (variant) => {
        setSelectedSize(variant.size);
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const priceAfterDiscount = selectedVariant
        ? Math.round(selectedVariant.price * (1 - selectedVariant.discount / 100))
        : 0;

    const totalPrice = priceAfterDiscount * quantity;

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Modal
            title="Chi tiết sản phẩm"
            open={open}
            onOk={onClose}
            onCancel={onClose}
            okText="Xác nhận"
            cancelText="Hủy"
            width={1000}
        >
            <div className={cx('modal-content')}>
                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : productDetails ? (
                    <>
                        <div className={cx('Product-Image')}>
                            <div className={cx('ImageBig')}>
                                <img
                                    src={selectedImage}
                                    alt={productDetails.productName}
                                    className={cx('modal-image')}
                                />
                            </div>
                            <div className={cx('ImageSmalls')}>
                                <Slider {...sliderSettings}>
                                    {productDetails.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={cx('image-small')}
                                            onClick={() => handleImageClick(image)}
                                        >
                                            <img src={image} alt={`${productDetails.productName} ${index}`} />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        <div className={cx('Product-Detail')}>
                            <p className={cx('categoryName')}>
                                Loại sản phẩm: <span>{productDetails.category_name}</span>
                            </p>
                            <p className={cx('productName')}>
                                Tên sản phẩm: <span>{productDetails.productName}</span>
                            </p>

                            {productDetails.variations && productDetails.variations.length > 0 ? (
                                <div>
                                    <p>Chọn kích thước:</p>
                                    <div className={cx('size-options')}>
                                        {productDetails.variations.map((variant) => (
                                            <button
                                                key={variant.variation_id}
                                                className={cx({ selected: selectedSize === variant.size })}
                                                onClick={() => handleSizeClick(variant)}
                                            >
                                                {variant.size}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedVariant && (
                                        <div className={cx('variant-details')}>
                                            <p className={cx('quantity-size')}>Số lượng tồn: {selectedVariant.stock}</p>
                                            {selectedVariant.discount > 0 ? (
                                                <div className={cx('price')}>
                                                    <div className={cx('price-sale')}>
                                                        <p>Thành tiền: {totalPrice.toLocaleString()} VND</p>
                                                        <h6 className={cx('precent-sale')}>
                                                            {selectedVariant.discount}%
                                                        </h6>
                                                    </div>
                                                    <p className={cx('price-origin')}>
                                                        Giá gốc: {selectedVariant.price.toLocaleString()} VND
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className={cx('price-no-sale')}>
                                                    Thành tiền: {(selectedVariant.price * quantity).toLocaleString()}{' '}
                                                    VND
                                                </p>
                                            )}

                                            <div className={cx('Quantity')}>
                                                <p onClick={() => adjustQuantity(-1)} style={{ cursor: 'pointer' }}>
                                                    -
                                                </p>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    min="1"
                                                    style={{ width: '50px', textAlign: 'center' }}
                                                />
                                                <p onClick={() => adjustQuantity(1)} style={{ cursor: 'pointer' }}>
                                                    +
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Không có biến thể nào.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Không tìm thấy chi tiết sản phẩm.</p>
                )}
            </div>
        </Modal>
    );
}

export default ProductDetailModal;
