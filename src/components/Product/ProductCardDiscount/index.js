import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductCardDiscount.module.scss';

const cx = classNames.bind(styles);

function ProductCardDiscount({ product, isSelected, onProductSelect }) {
    return (
        <div className={cx('product-card')}>
            <div className={cx('product__select')}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onProductSelect(product.id)}
                />
            </div>
            <div className={cx('product__img')}>
                <img src={product.image} alt={product.name} className={cx('product-img')} />
            </div>
            <div className={cx('product__info')}>
                <p className={cx('product-name')}>
                    <strong>Product Name:</strong> {product.name}
                </p>
                <p className={cx('product-price')}>
                    <strong>Price:</strong> {product.price.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

export default ProductCardDiscount;
