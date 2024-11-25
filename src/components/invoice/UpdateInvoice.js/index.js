import React, { useState } from 'react';
import { Modal, Form, Select, Button, notification } from 'antd';
import { updateInvoiceStatusAPI } from '~/apis/invoice';

const { Option } = Select;

const UpdateInvoice = ({ visible, onCancel, onUpdateStatus, invoice_id, currentStatus, onPaymentStatusUpdate }) => {
    const handleUpdateStatus = async (values) => {
        const requestData = {
            invoiceId: invoice_id,
            paymentStatus: values.paymentStatus,
            orderStatus: values.orderStatus,
        };

        try {
            await updateInvoiceStatusAPI(requestData);

            onCancel();

            notification.success({
                message: 'Cập nhật trạng thái thành công',
            });
        } catch (error) {
            console.error('Error updating invoice status:', error);
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Vui lòng thử lại sau.',
            });
        }
    };

    return (
        <Modal title="Cập nhật trạng thái đơn hàng" visible={visible} onCancel={onCancel} footer={null}>
            <Form
                name="update-order-status"
                onFinish={handleUpdateStatus}
                initialValues={{
                    paymentStatus: 'pending',
                    orderStatus: currentStatus || 'pending',
                }}
            >
                <Form.Item
                    label="Trạng thái thanh toán"
                    name="paymentStatus"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái thanh toán!' }]}
                >
                    <Select>
                        <Option value="Đang chờ thanh toán">Đang chờ thanh toán</Option>
                        <Option value="Đã thanh toán">Đã thanh toán</Option>
                        <Option value="Thanh Toán thât bại">Thanh toán thất bại</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Trạng thái đơn hàng"
                    name="orderStatus"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }]}
                >
                    <Select>
                        <Option value="Đang chờ xử lý">Đang chờ xử lý</Option>
                        <Option value="Đang xử lý">Đang xử lý</Option>
                        <Option value="Đã giao">Đã giao</Option>
                        <Option value="Đã nhận">Đã nhận</Option>
                        <Option value="Đã hủy">Đã hủy</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateInvoice;
