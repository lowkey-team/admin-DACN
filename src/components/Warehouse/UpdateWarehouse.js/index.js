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

const UpdateWarehouse = ({
    visible,
    onCancel,
    onUpdateStatus,
    invoice_id,
    currentStatus,
    onPaymentStatusUpdate,
    fetchSupplierOrders,
    setPaymentStatus,
    setOrderStatus,
}) => {
    const handleUpdateStatus = async (values) => {
        const requestData = {
            orderSupplierId: invoice_id,
            orderStatus: values.orderStatus,
            paymentStatus: values.paymentStatus,
        };
        console.log('data: ', requestData);
        try {
            await updateOrderSupplierAPI(requestData);
            fetchSupplierOrders();
            onCancel();
            setPaymentStatus(requestData.paymentStatus);
            setOrderStatus(requestData.orderStatus);
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
                        <Option value="Đang chờ thanh toán">
                            <Tag color={statusColors.pending}>Đang chờ thanh toán</Tag>
                        </Option>
                        <Option value="Đã thanh toán">
                            <Tag color={statusColors.paid}>Đã thanh toán</Tag>
                        </Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Trạng thái đơn hàng"
                    name="orderStatus"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }]}
                >
                    <Select>
                        <Option value="Đang chờ xử lý">
                            <Tag color={statusColors.pending}>Đang chờ xử lý</Tag>
                        </Option>

                        <Option value="Đã giao">
                            <Tag color={statusColors.delivered}>Đã giao</Tag>
                        </Option>
                        <Option value="Đã nhận">
                            <Tag color={statusColors.received}>Đã nhận</Tag>
                        </Option>
                        <Option value="Đã hủy">
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
