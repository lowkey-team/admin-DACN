import classNames from 'classnames/bind';
import style from './ModelOrderSupplierDetail.module.scss';
import { Modal, Button, Typography, Table, Row, Col, Tag, Input, notification } from 'antd';
import Barcode from 'react-barcode';
import { Box, padding } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { findByIdOrderSupplierAPI, updateOrderSupplierDetailsAPI } from '~/apis/warehoues';
import htmlDocx from 'html-docx-js/dist/html-docx';
import 'jspdf-autotable';
import { formatCurrency } from '~/utils/dateUtils';
import UpdateWarehouse from '../UpdateWarehouse.js';
import { UpdateTotalPriceOrderSupplierAPI } from '~/apis/invoice';

// import UpdateInvoice from '../UpdateInvoice.js';

const cx = classNames.bind(style);

function ModelOrderSupplierDetail({ invoiceDetails, open, onClose }) {
    const [invoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const componentRef = useRef();

    useEffect(() => {
        console.log('Data orderSupplierDetail (as JSON):', JSON.stringify(invoiceDetails, null, 2));
        if (open && invoiceDetails && invoiceDetails.id) {
            fetchInvoiceData();
        }
    }, [open, invoiceDetails]);

    const handlePrint = () => {
        if (!invoiceDetails || !invoiceDetails.customerName || !invoiceDetails.invoice_id) {
            console.error('Invoice details are missing!');
            return;
        }

        if (!invoiceData || !Array.isArray(invoiceData) || invoiceData.length === 0) {
            console.error('Invoice data is missing or empty!');
            return;
        }

        const barcodeCanvas = document.createElement('canvas');

        const barcode = new Barcode({
            value: invoiceDetails.invoice_id,
            width: 2,
            height: 50,
        });

        barcode.render(barcodeCanvas);

        const barcodeImgUrl = barcodeCanvas.toDataURL();

        const invoiceHTML = `
       
        `;

        const converted = htmlDocx.asBlob(invoiceHTML);

        const link = document.createElement('a');
        link.href = URL.createObjectURL(converted);
        link.download = `${invoiceDetails.invoice_id}_invoice.docx`;
        link.click();
    };

    const fetchInvoiceData = async () => {
        setLoading(true);
        try {
            const response = await findByIdOrderSupplierAPI(invoiceDetails.id);
            console.log('Chi tiết hóa đơn:', response);

            if (Array.isArray(response) && response.length > 0) {
                setInvoiceData(response);
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
            title: 'Số lượng nhập',
            dataIndex: 'ImportQuantity',
            key: 'ImportQuantity',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleQuantityChange(e, record.order_detail_id)}
                    onBlur={(e) => handleBlurAmount(e, record.order_detail_id)} // Lưu lại sau khi nhập xong
                    style={{ width: '100px' }}
                />
            ),
        },
        {
            title: 'Đơn giá nhập',
            dataIndex: 'UnitPrice',
            key: 'UnitPrice',
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handlePriceChange(e, record.order_detail_id)}
                    onBlur={(e) => handleBlurAmount(e, record.order_detail_id)} // Lưu lại sau khi nhập xong
                    style={{ width: '100px' }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'Amount',
            key: 'Amount',
            render: (text, record) => {
                // Tính thành tiền
                const amount = (record.ImportQuantity || 0) * (record.UnitPrice || 0);
                return formatCurrency(amount);
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
        const updatedDetail = invoiceData.find((item) => item.order_detail_id === orderDetailId);

        if (!updatedDetail) {
            console.error('Order detail not found');
            return;
        }

        const requestData = {
            id: orderDetailId,
            importQuantity: updatedDetail.ImportQuantity,
            status: updatedDetail.status || 0,
            unitPrice: updatedDetail.UnitPrice,
        };
        console.log('Data id', invoiceDetails.id);

        try {
            const response = await updateOrderSupplierDetailsAPI(requestData);
            console.log('Updated order supplier details:', response);

            await UpdateTotalPriceOrderSupplierAPI(invoiceDetails.id);
            notification.success({
                message: 'Cập nhật chi tiết đơn hàng thành công',
            });
        } catch (error) {
            console.error('Error updating order supplier details:', error);
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Vui lòng thử lại sau.',
            });
        }
    };

    const handleQuantityChange = (e, orderDetailId) => {
        const newValue = e.target.value;

        setInvoiceData((prevData) =>
            prevData.map((item) =>
                item.order_detail_id === orderDetailId ? { ...item, ImportQuantity: newValue } : item,
            ),
        );
    };

    const handlePriceChange = (e, orderDetailId) => {
        const newValue = e.target.value;

        setInvoiceData((prevData) =>
            prevData.map((item) => (item.order_detail_id === orderDetailId ? { ...item, UnitPrice: newValue } : item)),
        );
    };

    const handleBlurAmount = (e, orderDetailId) => {
        const rawValue = e.target.value.replace(/,/g, '');
        setInvoiceData((prevData) =>
            prevData.map((item) =>
                item.order_detail_id === orderDetailId ? { ...item, Amount: formatCurrencyInput(rawValue) } : item,
            ),
        );
    };

    const formatCurrencyInput = (value) => {
        if (!value) return '';
        return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
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
                                            Nhân viên tạo hóa đơn:{invoiceDetails.employee_name}
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
                                        <Typography.Text>Ngày nhận: {invoiceDetails.DateOfReceipt} </Typography.Text>

                                        <Typography.Text>
                                            Trạng thái đơn hàng:
                                            <Tag
                                                color={invoiceDetails.order_status === 'Chưa giao' ? 'volcano' : 'cyan'}
                                            >
                                                {invoiceDetails.order_status}
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
                                                <Tag
                                                    color={
                                                        invoiceDetails.payment_status === 'Chưa thanh toán'
                                                            ? 'volcano'
                                                            : 'cyan'
                                                    }
                                                >
                                                    {invoiceDetails.payment_status}
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
                                currentStatus={invoiceDetails.order_status}
                                onPaymentStatusUpdate={invoiceDetails.payment_status}
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
