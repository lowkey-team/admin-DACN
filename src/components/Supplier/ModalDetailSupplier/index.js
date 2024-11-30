import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import classNames from 'classnames/bind';
import styles from './ModalDetailSupplier.module.scss';
import { updateSupplierAPI, deleteSupplierAPI } from '~/apis/supplier';

const cx = classNames.bind(styles);

function ModalDetailSupplier({ open, onClose, supplierDetails, onUpdateSuccess, onDeleteSuccess }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm(); 

    React.useEffect(() => {
        if (supplierDetails) {
            form.setFieldsValue({
                SupplierName: supplierDetails.SupplierName,
                address: supplierDetails.address || '',
                phoneNumber: supplierDetails.phoneNumber || '',
                Email: supplierDetails.Email || '',
                contactPerson: supplierDetails.contactPerson || '',
                createdAt: new Date(supplierDetails.createdAt).toLocaleString(),
            });
        }
    }, [supplierDetails, form]);

    const handleUpdate = async () => {
        Modal.confirm({
            title: 'Xác nhận cập nhật',
            content: 'Bạn có chắc chắn muốn cập nhật thông tin nhà cung cấp này không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const values = await form.validateFields(); 
                    const formData = {
                        SupplierName: values.SupplierName,
                        address: values.address,
                        phoneNumber: values.phoneNumber,
                        Email: values.Email,
                        contactPerson: values.contactPerson,
                    };
                    console.log("Dữ liệu gửi đi khi cập nhật:", formData);
    
                    const response = await updateSupplierAPI(supplierDetails.id, formData);
                    message.success('Cập nhật nhà cung cấp thành công!');
                    onUpdateSuccess(response); 
                    onClose(); 
                } catch (error) {
                    console.error('Error updating supplier:', error);
                    // message.error('Đã xảy ra lỗi khi cập nhật nhà cung cấp.');
                    setIsEditing(false);
                    onClose();
                }
            },
            onCancel: () => {
                console.log('Cập nhật bị hủy');
                setIsEditing(false);
            },
        });
    };
    
    // Xử lý xóa nhà cung cấp
    const handleDelete = async () => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa nhà cung cấp này không? Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await deleteSupplierAPI(supplierDetails.id); 
                    if (response) {
                        message.success('Nhà cung cấp đã được xóa!');
                        onDeleteSuccess(supplierDetails.id);
                        onClose();
                    } else {
                        message.error('Không thể xóa nhà cung cấp.');
                        onClose();
                    }
                } catch (error) {
                    console.error('Error deleting supplier:', error);
                    // message.error('Đã xảy ra lỗi khi xóa nhà cung cấp.');
                    onClose();
                }
            },
            onCancel: () => {
                console.log('Xóa bị hủy');
            },
        });
    };

    return (
        <Modal
            title="Chi Tiết Nhà Cung Cấp"
            visible={open}
            centered
            onCancel={onClose}
            footer={[
                isEditing ? (
                    <Button key="update" type="primary" onClick={handleUpdate}>
                        Cập Nhật
                    </Button>
                ) : null,
                !isEditing ? (
                    <Button key="edit" onClick={() => setIsEditing(true)}>
                        Sửa
                    </Button>
                ) : null,
                !isEditing ? (
                    <Button key="delete" type="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                ) : null,
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            width={800}
        >
            {supplierDetails ? (
                <Form form={form} layout="vertical" disabled={!isEditing}>
                    <Form.Item label="Tên Nhà Cung Cấp" name="SupplierName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Địa Chỉ" name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Số Điện Thoại" name="phoneNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="Email">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Người Liên Hệ" name="contactPerson">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ngày Tạo" name="createdAt">
                        <Input disabled />
                    </Form.Item>
                </Form>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </Modal>
    );
}

export default ModalDetailSupplier;
