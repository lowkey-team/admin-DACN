import React, { useState } from 'react';
import { Modal, Form, Select, Button, notification, Tag  } from 'antd';
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
                    paymentStatus: onPaymentStatusUpdate,
                    orderStatus: currentStatus || 'pending',
                }}
            >
                <Form.Item
                    label="Trạng thái thanh toán"
                    name="paymentStatus"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái thanh toán!' }]}
                >
                    <Select>
                        <Option value="Đang chờ thanh toán"><Tag color="gold">Đang chờ thanh toán</Tag></Option>
                        <Option value="Đã thanh toán"> <Tag color="green">Đã thanh toán</Tag></Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Trạng thái đơn hàng"
                    name="orderStatus"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }]}
                >
                    <Select>
                        <Option value="Chờ thanh toán"> <Tag color="blue">Chờ thanh toán</Tag></Option>
                        <Option value="Đang xử lý"><Tag color="lime">Đang xử lý</Tag></Option>
                        <Option value="Chờ lấy hàng"> <Tag color="gold">Chờ lấy hàng</Tag></Option>
                        <Option value="Chờ giao hàng"> <Tag color="magenta">Chờ giao hàng</Tag></Option>
                        <Option value="Trả hàng"> <Tag color="purple">Trả hàng</Tag></Option>
                        <Option value="Được giao"> <Tag color="green">Được giao</Tag></Option>
                        <Option value="Đã hủy"> <Tag color="red">Đã hủy</Tag></Option>

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
