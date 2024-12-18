import classNames from 'classnames/bind';
import style from './ModelOrderSupplierDetail.module.scss';
import { Modal, Button, Typography, Table, Row, Col, Tag, Input, notification } from 'antd';
import Barcode from 'react-barcode';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { findByIdOrderSupplierAPI, updateOrderSupplierDetailsAPI, updateStockWarehouseAPI } from '~/apis/warehoues';
import 'jspdf-autotable';
import { formatCurrency } from '~/utils/dateUtils';
import UpdateWarehouse from '../UpdateWarehouse.js';
import { UpdateTotalPriceOrderSupplierAPI } from '~/apis/invoice';

// import UpdateInvoice from '../UpdateInvoice.js';

const cx = classNames.bind(style);

function ModelOrderSupplierDetail({ invoiceDetails, open, onClose, fetchSupplierOrders }) {
    const [invoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const componentRef = useRef();
    const [totalAmount, setTotalAmount] = useState(0);

    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [inputQuantities, setInputQuantities] = useState({});

    useEffect(() => {
        setOrderStatus(invoiceDetails?.order_status);
        setPaymentStatus(invoiceDetails?.payment_status);
    }, [invoiceDetails]);

    useEffect(() => {
        console.log('Data orderSupplierDetail (as JSON):', JSON.stringify(invoiceDetails, null, 2));
        if (open && invoiceDetails && invoiceDetails.id) {
            fetchInvoiceData();
        }
    }, [open, invoiceDetails, isModalVisible]);
    const handleInputChange = (e, orderDetailId) => {
        const { value } = e.target;

        setInputQuantities((prevQuantities) => ({
            ...prevQuantities,
            [orderDetailId]: value ? parseInt(value, 10) : null,
        }));
    };

    const calculateTotalAmount = (data) => {
        return data.reduce((total, record) => {
            const amount = (record.ImportQuantity || 0) * (record.UnitPrice || 0);
            return total + amount;
        }, 0);
    };
    const fetchInvoiceData = async () => {
        setLoading(true);
        try {
            const response = await findByIdOrderSupplierAPI(invoiceDetails.id);
            console.log('Chi tiết hóa đơn:', response);

            if (Array.isArray(response) && response.length > 0) {
                setInvoiceData(response);
                setTotalAmount(calculateTotalAmount(response));
            } else {
                setInvoiceData([]);
                console.error('Dữ liệu nhận được không phải mảng hoặc bị rỗng.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu hóa đơn:', error);
            setInvoiceData([]);
        } finally {
            setLoading(false);
        }
    };

    console.log('All products', invoiceData);
    const columns = [
        {
            title: 'Mã chi tiết',
            dataIndex: 'order_detail_id',
            key: 'order_detail_id',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'product_image_url',
            key: 'product_image_url',
            render: (text) => (
                <img src={text} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Kích thước',
            dataIndex: 'product_size',
            key: 'product_size',
        },
        {
            title: 'Số lượng đặt',
            dataIndex: 'QuantityOrdered',
            key: 'QuantityOrdered',
        },
        {
            title: 'Số lượng đã nhập',
            dataIndex: 'ImportQuantity',
            key: 'ImportQuantity',
        },

        {
            title: 'Đơn giá nhập',
            dataIndex: 'UnitPrice',
            key: 'UnitPrice',
            render: (value) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(value),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'Amount',
            key: 'Amount',
            render: (value) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(value),
        },

        {
            title: 'Nhập số lượng',
            key: 'updateQuantity',
            render: (text, record) => {
                const remainingQuantity = record.QuantityOrdered - record.ImportQuantity;

                return (
                    <Input
                        type="number"
                        min={0}
                        max={remainingQuantity}
                        value={inputQuantities[record.order_detail_id] ?? remainingQuantity} // Hiển thị số lượng cập nhật mới, mặc định là remainingQuantity
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                handleInputChange({ target: { value: null } }, record.order_detail_id);
                            } else {
                                const parsedValue = parseInt(value, 10);
                                if (parsedValue >= 0 && parsedValue <= remainingQuantity) {
                                    handleInputChange(e, record.order_detail_id);
                                }
                            }
                        }}
                    />
                );
            },
        },

        {
            title: 'Cập nhật',
            key: 'update',
            render: (text, record) => (
                <Button onClick={() => handleUpdate(record.order_detail_id)} type="primary">
                    Cập nhật
                </Button>
            ),
        },
    ];

    const handleUpdate = async (orderDetailId) => {
        const updatedQuantity =
            inputQuantities[orderDetailId] ??
            invoiceData.find((item) => item.order_detail_id === orderDetailId)?.QuantityOrdered -
                invoiceData.find((item) => item.order_detail_id === orderDetailId)?.ImportQuantity;

        if (updatedQuantity === undefined) {
            console.error('Số lượng nhập không hợp lệ');
            notification.error({
                message: 'Số lượng nhập không hợp lệ',
                description: 'Vui lòng kiểm tra và nhập lại số lượng.',
            });
            return;
        }

        const updatedDetail = invoiceData.find((item) => item.order_detail_id === orderDetailId);

        if (!updatedDetail) {
            console.error('Order detail not found');
            return;
        }

        const requestData = {
            ID_Variation: updatedDetail.variation_id,
            newStock: updatedQuantity,
            orderID: updatedDetail.order_detail_id,
        };

        try {
            const response = await updateStockWarehouseAPI(requestData);
            console.log('Updated order supplier details:', response);
            notification.success({
                message: 'Cập nhật chi tiết đơn hàng thành công',
            });

            setInputQuantities((prevQuantities) => ({
                ...prevQuantities,
                [orderDetailId]: 0,
            }));

            fetchInvoiceData();
        } catch (error) {
            console.error('Error updating order supplier details:', error);
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Vui lòng thử lại sau.',
            });
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleUpdateStatus = () => {
        setIsModalVisible(true);
        console.log('Update status');
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={1300}
            title="Chi tiết đơn hàng nhập"
            className={cx('container')}
        >
            {invoiceDetails ? (
                <>
                    <Row gutter={16} ref={componentRef}>
                        <Col span={18}>
                            {/* Thông tin chung */}

                            <div className={cx('info-section')} style={{ padding: '10px' }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Typography.Title level={5}>{invoiceDetails.id}</Typography.Title>
                                        <Box>
                                            <Barcode className={cx('barcode-container')} value={invoiceDetails.id} />
                                        </Box>
                                        <Typography.Text>
                                            Nhân viên tạo hóa đơn: {invoiceDetails.employee_name}
                                            <br />
                                            Ngày tạo hóa đơn: {invoiceDetails.OrderDate}
                                            <br />
                                            Số điện thoại nv: {invoiceDetails.employee_phone}
                                        </Typography.Text>
                                    </Col>
                                    <Col span={12} className={cx('col-info')}>
                                        <Typography.Text>
                                            Tên nhà cung cấp: {invoiceDetails.supplier_name}
                                        </Typography.Text>
                                        <Typography.Text>
                                            SĐT Nhà cung cấp:{invoiceDetails.supplier_phone}{' '}
                                        </Typography.Text>
                                        <Typography.Text>
                                            Ngày nhận:{' '}
                                            {invoiceDetails.DateOfReceipt &&
                                            new Date(invoiceDetails.DateOfReceipt).getTime() !==
                                                new Date('1970-01-01T00:00:00Z').getTime()
                                                ? invoiceDetails.DateOfReceipt
                                                : ''}
                                        </Typography.Text>

                                        <Typography.Text>
                                            Trạng thái đơn hàng:
                                            <Tag color={orderStatus === 'Chưa giao' ? 'volcano' : 'cyan'}>
                                                {orderStatus}
                                            </Tag>
                                        </Typography.Text>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Row>
                                <Col span={24}>
                                    <div className={cx('info-section')}>
                                        <div className={cx('header-Title')}>
                                            <Typography.Title level={4}>Thông tin đơn hàng</Typography.Title>
                                        </div>
                                        <div className={cx('content-info')}>
                                            <Typography.Text>
                                                Trạng thái thanh toán:
                                                <Tag color={paymentStatus === 'Chưa thanh toán' ? 'volcano' : 'cyan'}>
                                                    {paymentStatus}
                                                </Tag>
                                            </Typography.Text>
                                            <br />
                                            <Typography.Text>
                                                Tổng tiền: {formatCurrency(invoiceDetails.TotalPrice)}
                                            </Typography.Text>

                                            <Row justify="center" style={{ marginTop: 20 }}>
                                                <Button
                                                    type="primary"
                                                    onClick={handleUpdateStatus}
                                                    style={{ width: 200 }}
                                                >
                                                    Cập nhật trạng thái đơn hàng
                                                </Button>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <UpdateWarehouse
                                invoice_id={invoiceDetails.id}
                                visible={isModalVisible}
                                onCancel={handleCancel}
                                onUpdateStatus={handleUpdateStatus}
                                currentStatus={orderStatus}
                                onPaymentStatusUpdate={paymentStatus}
                                fetchSupplierOrders={fetchSupplierOrders}
                                setPaymentStatus={setPaymentStatus}
                                setOrderStatus={setOrderStatus}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Table
                            dataSource={invoiceData}
                            columns={columns}
                            rowKey="id"
                            scroll={{ y: 200 }}
                            pagination={{
                                position: ['bottomCenter'],
                            }}
                        />
                    </Row>
                </>
            ) : (
                <Typography.Text>Không có thông tin chi tiết.</Typography.Text>
            )}
            <div style={{ textAlign: 'right' }}>
                <Button onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
}

export default ModelOrderSupplierDetail;
