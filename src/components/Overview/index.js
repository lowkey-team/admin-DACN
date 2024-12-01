import classNames from 'classnames/bind';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from './Overview.module.scss';

const cx = classNames.bind(styles);

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend
);

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
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-title')}>
                <h1 className={cx('title')}>Tổng Quan</h1>
                <button className={cx('btn-add')}>Thêm mới</button>
            </div>

            <div className={cx('content')}>
                <div className={cx('overview-cards')}>
                    <div className={cx('card', 'products')}>
                        <h3>Sản phẩm</h3>
                        <p>150</p>
                    </div>
                    <div className={cx('card', 'orders')}>
                        <h3>Đơn hàng hôm nay</h3>
                        <p>25</p>
                    </div>
                    <div className={cx('card', 'customers')}>
                        <h3>Khách hàng mới</h3>
                        <p>10</p>
                    </div>
                    <div className={cx('card', 'revenue')}>
                        <h3>Doanh thu</h3>
                        <p>35.000.000 VND</p>
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
