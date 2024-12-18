import classNames from 'classnames/bind';
import { Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './Overview.module.scss';
import { useEffect, useState } from 'react';
import {
    countAllOrdersTodayAPI,
    countAllProductAPI,
    countNewCustomerAPI,
    monthlyRevenueAPI,
    productVariantRevenueAPI,
    totalRevenueAPI,
} from '~/apis/Dashboard';
import { fetchSalesReportAPI } from '~/apis/report';
import { exportToExcelSALE } from '~/utils/excelUtils';

const cx = classNames.bind(styles);

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function Overview() {
    const [productCount, setProductCount] = useState(null);
    const [orderCount, setOrderCount] = useState(null);
    const [newCustomerCount, setNewCustomerCount] = useState(null);
    const [revenueTotal, setRevenueTotal] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [pieChartData, setPieChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
            },
        ],
    });

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [salesReport, setSalesReport] = useState([]);

    const fetchSalesReport = async () => {
        try {
            const data = await fetchSalesReportAPI(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0],
            );
            setSalesReport(data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu báo cáo:', error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(salesReport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesReport');
        XLSX.writeFile(workbook, 'SalesReport.xlsx');
    };

    useEffect(() => {
        const fetchPieChartData = async () => {
            try {
                const data = await productVariantRevenueAPI();
                console.log('Dữ liệu sản phẩm cho Pie Chart:', data.revenueData);

                const labels = data.revenueData.map((item) => `${item.productName} (${item.productSize})`);
                const revenueData = data.revenueData.map((item) => parseFloat(item.totalRevenue));
                const backgroundColors = data.revenueData.map(
                    (_, index) => `hsl(${(index * 360) / data.revenueData.length}, 70%, 60%)`,
                );

                setPieChartData({
                    labels: labels,
                    datasets: [
                        {
                            data: revenueData,
                            backgroundColor: backgroundColors,
                        },
                    ],
                });
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu biểu đồ tròn:', error);
            }
        };

        fetchPieChartData();
    }, []);

    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const data = await countAllProductAPI();
                setProductCount(data.productCount);
            } catch (error) {
                console.log('Lỗi khi tải dữ liệu tổng sản phẩm', error);
            }
        };

        fetchProductCount();
    }, []);

    useEffect(() => {
        const fetchTotalOrderToday = async () => {
            try {
                const data = await countAllOrdersTodayAPI();
                setOrderCount(data.totalOrders);
            } catch (error) {
                console.log('Lỗi khi tait dữ liệu tổng đơn hàng hôm nay', error);
            }
        };

        fetchTotalOrderToday();
    }, []);

    useEffect(() => {
        const fetchTotalNewCustomer = async () => {
            try {
                const data = await countNewCustomerAPI();
                setNewCustomerCount(data.countNewCus);
            } catch (error) {
                console.log('Lỗi khi tải dữ liệu tổng khách hàng mới', error);
            }
        };
        fetchTotalNewCustomer();
    }, []);

    useEffect(() => {
        const fetchTotalRevenue = async () => {
            try {
                const data = await totalRevenueAPI();
                setRevenueTotal(data.totalRevenue);
            } catch (error) {
                console.log('Lỗi khi tải dữ liệu doanh thu', error);
            }
        };
        fetchTotalRevenue();
    }, []);

    useEffect(() => {
        const fetchMonthlyRevenue = async () => {
            try {
                const data = await monthlyRevenueAPI();
                console.log('Dữ liệu doanh thu biểu đồ cột:', data);
                setMonthlyRevenue(data.monthlyRevenue);
            } catch (error) {
                console.error('Lỗi tải dữ liệu doanh thu theo tháng:', error);
            }
        };
        fetchMonthlyRevenue();
    }, []);

    const formatRevenue = revenueTotal !== null ? new Intl.NumberFormat('de-DE').format(parseFloat(revenueTotal)) : 0;

    const barChartData = {
        labels: monthlyRevenue.map((item) => {
            const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 12'];
            return monthNames[item.month - 1] || `Tháng ${item.month}`;
        }),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: monthlyRevenue.map((item) => parseFloat(item.totalRevenue)),
                backgroundColor: '#4caf50',
            },
        ],
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-title')}>
                <h1 className={cx('title')}>Tổng Quan</h1>
            </div>

            <div className={cx('content')}>
                <div className={cx('overview-cards')}>
                    <div className={cx('card', 'products')}>
                        <h3>Tổng Sản phẩm trong</h3>
                        <h3>cửa hàng của bạn</h3>
                        <p>{productCount !== null ? productCount : 0}</p>
                    </div>
                    <div className={cx('card', 'orders')}>
                        <h3>Tổng đơn hàng </h3>
                        <h3>mới nhất hôm nay</h3>
                        <p>{orderCount !== null ? orderCount : 0}</p>
                    </div>
                    <div className={cx('card', 'customers')}>
                        <h3>Tổng hách hàng mới </h3>
                        <h3>trong 7 ngày qua</h3>
                        <p>{newCustomerCount !== null ? newCustomerCount : 'Đang tải...'}</p>
                    </div>
                    <div className={cx('card', 'revenue')}>
                        <h3>Tổng doanh thu</h3>
                        <h3>từ trước đến nay</h3>
                        <p>{formatRevenue} VNĐ</p>
                    </div>
                </div>

                <div className={cx('charts')}>
                    <div className={cx('chart')}>
                        <h3>Biểu đồ doanh thu</h3>
                        <Bar data={barChartData} />
                    </div>
                    <div className={cx('chart')}>
                        <h3>Tỷ lệ sản phẩm bán chạy</h3>
                        <Pie data={pieChartData} />
                    </div>
                </div>

                <h2>Chọn ngày báo cáo</h2>
                <div className={cx('date-picker')}>
                    <div>
                        <label>Ngày bắt đầu: </label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <div>
                        <label>Ngày kết thúc: </label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>

                <div className={cx('btn__action')}>
                    <button onClick={fetchSalesReport}>Lấy dữ liệu</button>
                    <button onClick={() => exportToExcelSALE(salesReport)}>Xuất Excel</button>
                </div>

                <div className={cx('report-table')}>
                    <h3>Báo cáo doanh thu</h3>
                    {salesReport.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <th>Biến thể</th>
                                    <th>Số lượng đã bán</th>
                                    <th>Giá bán</th>
                                    <th>Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesReport.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.ProductName}</td>
                                        <td>{item.VariantName}</td>
                                        <td>{item.QuantitySold}</td>
                                        <td>{parseFloat(item.SellingPrice).toLocaleString('de-DE')} VNĐ</td>
                                        <td>{parseFloat(item.TotalAmount).toLocaleString('de-DE')} VNĐ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có dữ liệu.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Overview;
