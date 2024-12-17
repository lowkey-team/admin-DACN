import React, { useState } from "react";
import classNames from 'classnames/bind';
import style from './Return.module.scss';

const cx = classNames.bind(style);

function ReturnAdmin() {
    const [requests, setRequests] = useState([
        { orderId: 'ORD123', customerName: 'Nguyễn Văn A', productName: 'Áo thun', reason: 'Sản phẩm bị lỗi', status: 'Chờ xử lý' },
        { orderId: 'ORD124', customerName: 'Trần Thị B', productName: 'Quần jean', reason: 'Không vừa ý', status: 'Chờ xử lý' },
        { orderId: 'ORD125', customerName: 'Lê Minh C', productName: 'Giày thể thao', reason: 'Không đúng mẫu mã', status: 'Chờ xử lý' },
    ]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
    };

    const handleApprove = () => {
        setStatusMessage('Yêu cầu đã được duyệt.');
        setRequests(requests.map(request => 
            request.orderId === selectedRequest.orderId 
            ? { ...request, status: 'Đã duyệt' } 
            : request
        ));
        setSelectedRequest(null);
    };

    const handleReject = () => {
        setStatusMessage('Yêu cầu đã bị từ chối.');
        setRequests(requests.map(request => 
            request.orderId === selectedRequest.orderId 
            ? { ...request, status: 'Đã từ chối' } 
            : request
        ));
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
                            <th>Mã đơn hàng</th>
                            <th>Tên khách hàng</th>
                            <th>Sản phẩm</th>
                            <th>Lý do đổi</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.orderId}>
                                <td>{request.orderId}</td>
                                <td>{request.customerName}</td>
                                <td>{request.productName}</td>
                                <td>{request.reason}</td>
                                <td>{request.status}</td>
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
                    <p><strong>Mã đơn hàng:</strong> {selectedRequest.orderId}</p>
                    <p><strong>Tên khách hàng:</strong> {selectedRequest.customerName}</p>
                    <p><strong>Sản phẩm:</strong> {selectedRequest.productName}</p>
                    <p><strong>Lý do đổi:</strong> {selectedRequest.reason}</p>
                    <p><strong>Trạng thái hiện tại:</strong> {selectedRequest.status}</p>

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
