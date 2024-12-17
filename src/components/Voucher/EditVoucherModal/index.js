import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, notification, Row, Col } from 'antd';
import moment from 'moment';
import { updateVoucherAPI } from '~/apis/Vouchers';

const EditVoucherModal = ({ visible, onCancel, onUpdate, voucher }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (voucher) {
            const formatValue = (value) => {
                return value % 1 === 0 ? value : Math.floor(value);
            };
            form.setFieldsValue({
                voucherCode: voucher.voucherCode,
                description: voucher.description,
                discountValue: voucher.discountValue,
                minOrderValue: formatValue(voucher.minOrderValue),
                maxUses: voucher.maxUses,
                startDate: voucher.startDate ? voucher.startDate.slice(0, 16) : '',
                endDate: voucher.endDate ? voucher.endDate.slice(0, 16) : '',
                isActive: voucher.isActive,
                max_discount_amount: formatValue(voucher.max_discount_amount),
            });
        }
    }, [voucher, form]);

    const handleSubmit = async (values) => {
        Modal.confirm({
            title: 'Xác nhận thay đổi',
            content: 'Bạn có chắc chắn muốn lưu những thay đổi này?',
            okText: 'Lưu thay đổi',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await updateVoucherAPI(voucher.id, values);
                    notification.success({
                        message: 'Thành công',
                        description: 'Voucher đã được cập nhật',
                    });
                    onUpdate();
                    onCancel();
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Cập nhật voucher không thành công';
                    notification.error({
                        message: 'Lỗi',
                        description: errorMessage,
                    });
                }
            },
            onCancel() {},
        });
    };

    return (
        <Modal visible={visible} title="Edit Voucher" onCancel={onCancel} footer={null} centered width={1000}>
            <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={voucher}>
                <Row gutter={16} style={{ marginBottom: 8 }}>
                    <Col span={12}>
                        <Form.Item
                            name="voucherCode"
                            label="Mã voucher"
                            rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
                            style={{ marginBottom: 1 }}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="discountValue"
                            label="% giảm"
                            rules={[{ required: true, message: 'Vui lòng nhập % giảm giá' }]}
                            style={{ marginBottom: 1 }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                            style={{ marginBottom: 1 }}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="minOrderValue"
                            label="Đơn tối thiểu"
                            rules={[{ required: true, message: 'Vui lòng nhập đơn tối thiểu' }]}
                            style={{ marginBottom: 1 }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="max_discount_amount"
                            label="Số tiền giảm tối đa"
                            rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm tối đa' }]}
                            style={{ marginBottom: 1 }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="startDate"
                            label="Ngày bắt đầu"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                            style={{ marginBottom: 1 }}
                        >
                            <Input type="datetime-local" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endDate"
                            label="Ngày kết thúc"
                            dependencies={['startDate']}
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = getFieldValue('startDate');
                                        if (!value || !startDate) {
                                            return Promise.resolve();
                                        }
                                        if (moment(value).isSameOrAfter(moment(startDate))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu'),
                                        );
                                    },
                                }),
                            ]}
                            style={{ marginBottom: 1 }}
                        >
                            <Input type="datetime-local" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="maxUses"
                            label="Số lượng"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng voucher' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Lưu thay đổi
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditVoucherModal;
