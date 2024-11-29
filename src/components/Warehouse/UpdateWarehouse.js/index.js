import React, { useState } from 'react';
import { Modal, Form, Select, Button, notification, Tag } from 'antd';
import { updateOrderSupplierAPI } from '~/apis/warehoues';

const { Option } = Select;

const statusColors = {
    pending: 'orange',
    processing: 'blue',
    delivered: 'green',
    received: 'geekblue',
    cancelled: 'red',
    failed: 'volcano',
    paid: 'success',
};

const UpdateWarehouse = ({ visible, onCancel, onUpdateStatus, invoice_id, currentStatus, onPaymentStatusUpdate }) => {
    const handleUpdateStatus = async (values) => {
        const requestData = {
            orderSupplierId: invoice_id,
            orderStatus: values.orderStatus,
            paymentStatus: values.paymentStatus,
        };
        console.log('data: ', requestData);
        try {
            await updateOrderSupplierAPI(requestData);

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
                        <Option value="pending">
                            <Tag color={statusColors.pending}>Đang chờ thanh toán</Tag>
                        </Option>
                        <Option value="paid">
                            <Tag color={statusColors.paid}>Đã thanh toán</Tag>
                        </Option>
                        <Option value="failed">
                            <Tag color={statusColors.failed}>Thanh toán thất bại</Tag>
                        </Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Trạng thái đơn hàng"
                    name="orderStatus"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }]}
                >
                    <Select>
                        <Option value="pending">
                            <Tag color={statusColors.pending}>Đang chờ xử lý</Tag>
                        </Option>
                        <Option value="processing">
                            <Tag color={statusColors.processing}>Đang xử lý</Tag>
                        </Option>
                        <Option value="delivered">
                            <Tag color={statusColors.delivered}>Đã giao</Tag>
                        </Option>
                        <Option value="received">
                            <Tag color={statusColors.received}>Đã nhận</Tag>
                        </Option>
                        <Option value="cancelled">
                            <Tag color={statusColors.cancelled}>Đã hủy</Tag>
                        </Option>
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

export default UpdateWarehouse;
