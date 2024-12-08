import classNames from 'classnames/bind';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './Overview.module.scss';
import { useEffect, useState } from 'react';
import { countAllOrdersTodayAPI, countAllProductAPI, countNewCustomerAPI, totalRevenueAPI } from '~/apis/Dashboard';

const cx = classNames.bind(styles);

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const barChartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
    datasets: [
        {
            label: 'Doanh thu (triệu VND)',
            data: [50, 70, 60, 90, 100],
            backgroundColor: '#4caf50',
        },
    ],
};

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

    const formatRevenue = revenueTotal !== null ? new Intl.NumberFormat('de-DE').format(parseFloat(revenueTotal)) : 0;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-title')}>
                <h1 className={cx('title')}>Tổng Quan</h1>
            </div>

            <div className={cx('content')}>
                <div className={cx('overview-cards')}>
                    <div className={cx('card', 'products')}>
                        <h3>Tổng Sản phẩm trong cửa hàng của bạn</h3>
                        <p>{productCount !== null ? productCount : 0}</p>
                    </div>
                    <div className={cx('card', 'orders')}>
                        <h3>Tổng đơn hàng mới nhất hôm nay</h3>
                        <p>{orderCount !== null ? orderCount : 0}</p>
                    </div>
                    <div className={cx('card', 'customers')}>
                        <h3>Tổng hách hàng mới trong 7 ngày qua</h3>
                        <p>{newCustomerCount !== null ? newCustomerCount : 'Đang tải...'}</p>
                    </div>
                    <div className={cx('card', 'revenue')}>
                        <h3>Tổng doanh thu từ trước đến nay</h3>
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
