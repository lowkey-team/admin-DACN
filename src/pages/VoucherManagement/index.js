import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form, Input, Button, Table, notification, Modal, Row, Col, Tag, Select } from 'antd';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { addNewVoucherAPI, deleteVoucherAPI, getAllVoucherAPI, updateVoucherAPI } from '~/apis/Vouchers';
import styles from './VoucherManagement.module.scss';
import EditVoucherModal from '~/components/Voucher/EditVoucherModal';
import { formatCurrency } from '~/utils/dateUtils';

const { Option } = Select;
const cx = classNames.bind(styles);

function VoucherManagement() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [filterStatus, setFilterStatus] = useState(null);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const data = await getAllVoucherAPI();
            setVouchers(data);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to fetch vouchers',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (voucher) => {
        setEditingVoucher(voucher);
        setIsModalVisible(true);
    };

    const handleDelete = (voucherId) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn xóa voucher này?',
            onOk: async () => {
                try {
                    await deleteVoucherAPI(voucherId);
                    notification.success({
                        message: 'Thành công',
                        description: 'Voucher đã được xóa',
                    });
                    fetchVouchers();
                } catch (error) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Có lỗi xảy ra khi xóa voucher',
                    });
                }
            },
        });
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
        setEditingVoucher(null);
        setIsEditing(false);
    };

    const handleAddVoucher = async (values) => {
        try {
            await addNewVoucherAPI(values);
            notification.success({
                message: 'Thành công',
                description: 'Voucher đã được tạo thành công',
            });
            fetchVouchers();
            form.resetFields();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi thêm voucher';
            notification.error({
                message: 'Lỗi',
                description: errorMessage,
            });
        }
    };

    const columns = [
        {
            title: 'Mã Voucher',
            dataIndex: 'voucherCode',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: '% giảm',
            dataIndex: 'discountValue',
        },
        {
            title: 'Đơn tối thiểu',
            dataIndex: 'minOrderValue',
            render: (value) => formatCurrency(value),
        },
        {
            title: 'Giảm tối đa',
            dataIndex: 'max_discount_amount',
            render: (value) => formatCurrency(value),
        },
        {
            title: 'Đã sử dụng',
            dataIndex: 'usedCount',
            render: (usedCount, record) => {
                const maxUses = record.maxUses;
                return `${usedCount} / ${maxUses}`;
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (startDate) => moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            render: (endDate) => moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (text) => <Tag color={text === 1 ? 'green' : 'red'}>{text === 1 ? 'Hoạt động' : 'Đã xóa'}</Tag>,
        },
        {
            title: 'Hành động',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEdit(record)} type="primary" style={{ marginRight: 8 }}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                        onClick={() => handleDelete(record.id)}
                        type="danger"
                        style={{ color: 'white', backgroundColor: 'red' }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
            ),
        },
    ];

    const fetchFilteredVouchers = async (status) => {
        setLoading(true);
        try {
            const data = await getAllVoucherAPI();
            const filteredData = status !== null ? data.filter((voucher) => voucher.isActive === status) : data;
            setVouchers(filteredData);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to fetch filtered vouchers',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusFilterChange = (value) => {
        setFilterStatus(value);
        if (value === null) {
            fetchVouchers();
        } else {
            fetchFilteredVouchers(value);
        }
    };

    return (
        <div className={cx('wrapper', 'container-fill')}>
            <div className={cx('row')}>
                <div className={cx('form__add-new')}>
                    <h3>Thêm voucher mới</h3>
                    <Form form={form} onFinish={handleAddVoucher} layout="vertical">
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
                                Thêm voucher
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <div className={cx('row')}>
                <h4 className={cx('title__List-voucher')}>Danh sách voucher</h4>
                <div>
                    <h5>Bộ lọc trạng thái</h5>
                    <Select
                        placeholder="Chọn trạng thái"
                        style={{ width: 200, marginBottom: 16 }}
                        value={filterStatus}
                        onChange={handleStatusFilterChange}
                    >
                        <Option value={null}>Tất cả</Option>
                        <Option value={1}>Hoạt động</Option>
                        <Option value={0}>Đã xóa</Option>
                    </Select>

                    <Table dataSource={vouchers} columns={columns} loading={loading} rowKey="id" />
                </div>
            </div>

            <EditVoucherModal
                visible={isModalVisible}
                onCancel={handleCancelModal}
                voucher={editingVoucher}
                onUpdate={fetchVouchers}
            />
        </div>
    );
}

export default VoucherManagement;
