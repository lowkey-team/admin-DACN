import classNames from 'classnames/bind';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './Overview.module.scss';
import { useEffect, useState } from 'react';
import {
    countAllOrdersTodayAPI,
    countAllProductAPI,
    countNewCustomerAPI,
    monthlyRevenueAPI,
    totalRevenueAPI,
} from '~/apis/Dashboard';

const cx = classNames.bind(styles);

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const pieChartData = {
    labels: ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C'],
    datasets: [
        {
            data: [40, 30, 30],
            backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'],
        },
    ],
};

function Overview() {
    const [productCount, setProductCount] = useState(null);
    const [orderCount, setOrderCount] = useState(null);
    const [newCustomerCount, setNewCustomerCount] = useState(null);
    const [revenueTotal, setRevenueTotal] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

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
            </div>
        </div>
    );
}

export default Overview;
