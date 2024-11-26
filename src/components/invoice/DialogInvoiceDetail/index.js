import classNames from 'classnames/bind';
import style from './DialogInvoiceDetail.module.scss';
import { Modal, Button, Typography, Table, Row, Col } from 'antd';
import Barcode from 'react-barcode';
import { Box, padding } from '@mui/system';

const cx = classNames.bind(style);

function DialogInvoiceDetail({ invoiceDetails, open, onClose }) {
    const columns = [
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    {text}
                    <Typography.Text type="secondary">Mã vạch: {record.barcode}</Typography.Text>
                </div>
            ),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
    ];

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
                <Row gutter={16}>
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
                                    <Typography.Text>
                                        Hình thức thanh toán: {invoiceDetails.paymentMethod}
                                    </Typography.Text>
                                    <Typography.Text>
                                        Trạng thái thanh toán: {invoiceDetails.paymentStatus}
                                    </Typography.Text>
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

                        {/* Danh sách sản phẩm */}
                        <Table
                            columns={columns}
                            dataSource={invoiceDetails.products}
                            rowKey="name"
                            pagination={false}
                            style={{ marginTop: 20 }}
                        />
                    </Col>
                    <Col span={6}>
                        <div className={cx('payment-summary')}>
                            <Typography.Text strong>Tạm tính: </Typography.Text>
                            <Typography.Text>{invoiceDetails.totalAmount}</Typography.Text>
                            <br />
                            <Typography.Text strong>Khuyến mãi: </Typography.Text>
                            <Typography.Text>{invoiceDetails.discountAmount}</Typography.Text>
                            <br />
                            <Typography.Text strong>Phí vận chuyển: </Typography.Text>
                            <Typography.Text>{invoiceDetails.shippingFee}</Typography.Text>
                            <br />
                            <Typography.Text strong>Mã giảm giá: </Typography.Text>
                            <Typography.Text>{invoiceDetails.voucherCode}</Typography.Text>
                            <br />
                            <Typography.Text strong style={{ color: 'red' }}>
                                Thành tiền: {invoiceDetails.finalAmount}
                            </Typography.Text>
                        </div>
                    </Col>
                </Row>
            ) : (
                <Typography.Text>Không có thông tin chi tiết.</Typography.Text>
            )}
            <div style={{ marginTop: 20, textAlign: 'right' }}>
                <Button onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
}

export default DialogInvoiceDetail;
