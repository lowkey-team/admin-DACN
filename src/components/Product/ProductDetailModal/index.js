import React from 'react';
import { Button, Modal } from 'antd';

function ProductDetailModal({ productID, open, onClose }) {
    return (
        <Modal
            title="Chi tiết sản phẩm"
            open={open}
            onOk={onClose}
            onCancel={onClose}
            okText="Xác nhận"
            cancelText="Hủy"
        >
            <p>Bla bla ...</p>
            <p>Bla bla ...</p>
            <p>Bla bla ...</p>
            <p>ID sản phẩm: {productID}</p>
        </Modal>
    );
}

export default ProductDetailModal;
