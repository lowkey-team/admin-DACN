import classNames from 'classnames/bind';
import style from './DialogInvoiceDetail.module.scss';
import { Modal, Button, Typography, Table, Row, Col } from 'antd';
import Barcode from 'react-barcode';
import { Box, padding } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { fecthInvoiceDetailListID_invoiceAPI } from '~/apis/invoice';
import UpdateInvoice from '../UpdateInvoice.js';
import htmlDocx from 'html-docx-js/dist/html-docx';
import 'jspdf-autotable';
// import UpdateInvoice from '../UpdateInvoice.js';

const cx = classNames.bind(style);

function DialogInvoiceDetail({ invoiceDetails, open, onClose }) {
    const [invoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const componentRef = useRef();

    useEffect(() => {
        if (open && invoiceDetails && invoiceDetails.invoice_id) {
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
        <html>
            <head>
                <style>
                    body {
                        font-family: 'Times New Roman', serif;
                    }
                    .invoice-header {
                        font-size: 18px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .invoice-title {
                        text-align: center; /* Căn giữa chữ "Hóa đơn bán hàng" */
                        font-size: 20px;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .invoice-table th,
                    .invoice-table td {
                        border: 1px solid #ccc;
                        padding: 5px;
                        text-align: left;
                    }
                    .invoice-total {
                        font-weight: bold;
                        text-align: right;
                    }
                    .company-info {
                        display: flex;
                        align-items: center;
                    }
                    .company-logo {
                        width: 50px;  /* Điều chỉnh kích thước logo */
                        height: auto;
                        margin-right: 10px;
                    }
                    .total-details p {
                        text-align: right;
                    }
                        .invoice-header {
                            display: flex;
                            justify-content: space-between; /* Căn chỉnh logo sang trái và tên công ty sang phải */
                            align-items: center; /* Căn giữa theo chiều dọc */
                            width: 100%;
                        }
    
                        .logo {
                            /* Đảm bảo logo không quá lớn */
                            max-width: 100px;
                            width: 50%;
                            text-align: right;
                        }
    
                        .company-details {
                            text-align: left; 
                            width: 50%;
                        }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <div class="company-info company-details">
                        <h2>THHH MỸ NGHỆ VIỆT</h2>
                        <p>Ngày: ${new Date().toLocaleDateString()}</p>
                    </div>
                   
                </div>
    
                <div class="invoice-title">
                    <p>HÓA ĐƠN BÁN HÀNG</p>
                </div>
    
                <div>
                    <h3>Mã hóa đơn: ${invoiceDetails.invoice_id}</h3>
                    <h3>Khách hàng: ${invoiceDetails.customerName}</h3>
                    <p>Địa chỉ: ${invoiceDetails.shippingAddress || 'N/A'}</p>
                    <p>Email: ${invoiceDetails.customerEmail || 'N/A'}</p>
                    <p>Điện thoại: ${invoiceDetails.customerPhone || 'N/A'}</p>
                    <p>Ngày tạo đơn hàng: ${invoiceDetails.createdAt || 'N/A'}</p>
                    <p>Ngày xuất hóa đơn: ${new Date().toLocaleDateString()}</p>
                    <p>Trạng thái đơn hàng: ${invoiceDetails.orderStatus || 'N/A'}</p>
                    <p>Trạng thái thanh toán: ${invoiceDetails.paymentStatus || 'N/A'}</p>
                </div>
    
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceData
                            .map(
                                (item) => `
                                    <tr>
                                        <td>${item.productName}</td>
                                        <td>${item.Quantity}</td>
                                        <td>${item.UnitPrice}</td>
                                    </tr>`,
                            )
                            .join('')}
                    </tbody>
                </table>
    
                <div class="invoice-total">
                    <p>Mã giảm giá: ${invoiceDetails.voucherCode || 'N/A'}</p>
                    <p>Số tiền gốc: ${invoiceDetails.totalAmount || 0}</p>
                    <p>Số tiền giảm: ${invoiceDetails.discountAmount || 0}</p>
                    <p>Số tiền sau khi giảm: ${invoiceDetails.finalAmount || 0}</p>
                </div>
    
                <div>
                    <p>Cảm ơn quý khách đã mua hàng!</p>
                </div>
                <div>
                    <img src="${barcodeImgUrl}" alt="Invoice Barcode" />
                </div>
            </body>
        </html>
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
            const response = await fecthInvoiceDetailListID_invoiceAPI(invoiceDetails.invoice_id);
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
            title: 'Hình ảnh',
            dataIndex: 'productImage',
            key: 'productImage',
            render: (text) => (
                <img src={text} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'Quantity',
            key: 'Quantity',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'UnitPrice',
            key: 'UnitPrice',
            render: (text) => <Typography.Text>{text.toLocaleString()}</Typography.Text>, // Định dạng giá trị đơn giá
        },
        {
            title: 'Thành tiền',
            dataIndex: 'Amount',
            key: 'Amount',
            render: (text) => <Typography.Text>{text.toLocaleString()}</Typography.Text>, // Định dạng giá trị thành tiền
        },
    ];

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
            title="Chi Tiết Đơn Hàng"
            className={cx('container')}
        >
            {invoiceDetails ? (
                <Row gutter={16} ref={componentRef}>
                    <Col span={18}>
                        {/* Thông tin chung */}

                        <div className={cx('info-section')} style={{ padding: '10px' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Typography.Title level={5}>{invoiceDetails.invoice_id}</Typography.Title>
                                    <Box>
                                        <Barcode
                                            className={cx('barcode-container')}
                                            value={invoiceDetails.invoice_id}
                                        />
                                    </Box>
                                    <Typography.Text>
                                        {invoiceDetails.createdAt} - NV tư vấn: {invoiceDetails.staffName} -{' '}
                                        {invoiceDetails.staffEmail}
                                    </Typography.Text>
                                </Col>
                                <Col span={12} className={cx('col-info')}>
                                    <Typography.Text>Trạng thái đơn hàng: {invoiceDetails.orderStatus}</Typography.Text>
                                    <Typography.Text>Ghi chú: {invoiceDetails.note}</Typography.Text>
                                </Col>
                            </Row>
                        </div>
                        {/* Thông tin khách hàng và người nhận */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className={cx('info-section')}>
                                    <div className={cx('header-Title')}>
                                        <Typography.Text strong>Khách Hàng</Typography.Text>
                                    </div>
                                    <div className={cx('content-info')}>
                                        <div>{invoiceDetails.customerName}</div>
                                        <div>{invoiceDetails.customerPhone}</div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className={cx('info-section')}>
                                    <div className={cx('header-Title')}>
                                        <Typography.Text strong>Người Nhận</Typography.Text>
                                    </div>
                                    <div className={cx('content-info')}>
                                        <div>{invoiceDetails.customerName}</div>
                                        <div>{invoiceDetails.phoneNumber}</div>
                                        <div>{invoiceDetails.shippingAddress}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Table
                            dataSource={invoiceData}
                            columns={columns}
                            rowKey="id"
                            scroll={{ y: 200 }}
                            pagination={{
                                position: ['bottomCenter'],
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <Row>
                            <Col span={24}>
                                <div className={cx('info-section')}>
                                    <div className={cx('header-Title')}>
                                        <Typography.Title level={4}>Thông tin đơn hàng</Typography.Title>
                                    </div>
                                    <div className={cx('content-info')}>
                                        <Typography.Text>Ngày tạo: {invoiceDetails.createdAt}</Typography.Text>
                                        <br />
                                        <Typography.Text>
                                            Trạng thái thanh toán: {invoiceDetails.orderStatus}
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text>
                                            Hình thức thanh toán: {invoiceDetails.paymentMethod}
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text>
                                            Trạng thái thanh toán: {invoiceDetails.paymentStatus}
                                        </Typography.Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <div className={cx('payment-summary')}>
                                    <div className={cx('summary-row')}>
                                        <Typography.Text className={cx('title')} strong>
                                            Tạm tính:
                                        </Typography.Text>
                                        <Typography.Text className={cx('value')}>
                                            {invoiceDetails.totalAmount}
                                        </Typography.Text>
                                    </div>
                                    <div className={cx('summary-row')}>
                                        <Typography.Text className={cx('title')} strong>
                                            Khuyến mãi:
                                        </Typography.Text>
                                        <Typography.Text className={cx('value')}>
                                            {invoiceDetails.discountAmount}
                                        </Typography.Text>
                                    </div>
                                    <div className={cx('summary-row')}>
                                        <Typography.Text className={cx('title')} strong>
                                            Phí vận chuyển:
                                        </Typography.Text>
                                        <Typography.Text className={cx('value')}>
                                            {invoiceDetails.shippingFee}
                                        </Typography.Text>
                                    </div>
                                    <div className={cx('summary-row')}>
                                        <Typography.Text className={cx('title')} strong>
                                            Mã giảm giá:
                                        </Typography.Text>
                                        <Typography.Text className={cx('value')}>
                                            {invoiceDetails.voucherCode}
                                        </Typography.Text>
                                    </div>
                                    <div className={cx('summary-row', 'total')}>
                                        <Typography.Text className={cx('title')} strong>
                                            Thành tiền:
                                        </Typography.Text>
                                        <Typography.Text className={cx('value')}>
                                            {invoiceDetails.finalAmount}
                                        </Typography.Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row justify="center" style={{ marginTop: 20 }}>
                            <Button type="primary" onClick={handleUpdateStatus} style={{ width: 200 }}>
                                Cập nhật trạng thái đơn hàng
                            </Button>
                        </Row>

                        <UpdateInvoice
                            invoice_id={invoiceDetails.invoice_id}
                            visible={isModalVisible}
                            onCancel={handleCancel}
                            onUpdateStatus={handleUpdateStatus}
                            currentStatus={invoiceDetails.orderStatus}
                            onPaymentStatusUpdate={invoiceDetails.orderStatus}
                        />
                    </Col>

                    <Button type="primary" onClick={handlePrint} style={{ width: 200 }}>
                        xuất hóa đơn
                    </Button>
                </Row>
            ) : (
                <Typography.Text>Không có thông tin chi tiết.</Typography.Text>
            )}
            <div style={{ textAlign: 'right' }}>
                <Button onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
}

export default DialogInvoiceDetail;
