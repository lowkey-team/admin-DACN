import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './Return.module.scss';
import { fetchAllReturnDetail } from '~/apis/ReturnDetail';

const cx = classNames.bind(style);

function ReturnAdmin() {
    const [requests, setRequests] = useState([]); // State lưu danh sách yêu cầu
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    // Fetch data từ API khi component được mount
    useEffect(() => {
        const loadReturnDetails = async () => {
            try {
                const data = await fetchAllReturnDetail(); // Gọi API
                setRequests(data); // Cập nhật state
            } catch (error) {
                console.error('Failed to load return details:', error);
            }
        };

        loadReturnDetails();
    }, []);

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
    };

    const handleApprove = () => {
        setStatusMessage('Yêu cầu đã được duyệt.');
        setRequests(
            requests.map((request) =>
                request.id_returnInvoice === selectedRequest.id_returnInvoice
                    ? { ...request, return_status: 'Đã duyệt' }
                    : request,
            ),
        );
        setSelectedRequest(null);
    };

    const handleReject = () => {
        setStatusMessage('Yêu cầu đã bị từ chối.');
        setRequests(
            requests.map((request) =>
                request.id_returnInvoice === selectedRequest.id_returnInvoice
                    ? { ...request, return_status: 'Đã từ chối' }
                    : request,
            ),
        );
        setSelectedRequest(null);
    };

    return (
        <div className={cx('admin-container')}>
            <h2>Quản lý yêu cầu đổi hàng</h2>

            {statusMessage && <div className={cx('status-message')}>{statusMessage}</div>}

            <div className={cx('request-list')}>
                <h3>Danh sách yêu cầu đổi hàng</h3>
                <table className={cx('request-table')}>
                    <thead>
                        <tr>
                            <th>Mã hóa đơn</th>
                            <th>Tên khách hàng</th>
                            <th>Sản phẩm</th>
                            <th>Lý do đổi</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id_returnInvoice}>
                                <td>{request.invoice_id}</td>
                                <td>{request.user_name}</td>
                                <td>{request.product_name}</td>
                                <td>{request.return_reason}</td>
                                <td>{request.return_status}</td>
                                <td>
                                    <button onClick={() => handleSelectRequest(request)}>Xem chi tiết</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedRequest && (
                <div className={cx('request-detail')}>
                    <h3>Chi tiết yêu cầu đổi hàng</h3>
                    <p>
                        <strong>Mã hóa đơn:</strong> {selectedRequest.invoice_id}
                    </p>
                    <p>
                        <strong>Tên khách hàng:</strong> {selectedRequest.user_name}
                    </p>
                    <p>
                        <strong>Sản phẩm:</strong> {selectedRequest.product_name}
                    </p>
                    <p>
                        <strong>Lý do đổi:</strong> {selectedRequest.return_reason}
                    </p>
                    <p>
                        <strong>Trạng thái hiện tại:</strong> {selectedRequest.return_status}
                    </p>
                    <p>
                        <strong>Ngày tạo:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Số điện thoại:</strong> {selectedRequest.phone}
                    </p>
                    <img
                        src={selectedRequest.img_return}
                        alt="Ảnh sản phẩm đổi"
                        style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                    />

                    <div className={cx('actions')}>
                        <button onClick={handleApprove}>Duyệt yêu cầu</button>
                        <button onClick={handleReject}>Từ chối yêu cầu</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReturnAdmin;
