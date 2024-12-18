import classNames from 'classnames/bind';
import { message } from 'antd';

import styles from './ListDiscountVariant.module.scss';
import { deleteDiscountVariantAPI, getListDiscountVariant } from '~/apis/DiscountVariant';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ListDiscountVariant() {
    const [discountVariants, setDiscountVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleback = () => {
        navigate('/promotion');
    };
    useEffect(() => {
        const fetchDiscountVariants = async () => {
            try {
                setLoading(true);
                const data = await getListDiscountVariant();
                console.log('data giảm giá: ', data);
                setDiscountVariants(data);
            } catch (err) {
                setError('Lỗi khi tải danh sách giảm giá');
            } finally {
                setLoading(false);
            }
        };

        fetchDiscountVariants();
    }, []);

    const handleDelete = async (id) => {
        console.log('id xóa:', id);
        if (window.confirm('Bạn có chắc chắn muốn xóa giảm giá này không?')) {
            try {
                await deleteDiscountVariantAPI(id);
                setDiscountVariants((prev) => prev.filter((variant) => variant.id !== id));
                message.success('Xóa giảm giá thành công!');
            } catch (err) {
                message.error('Lỗi khi xóa giảm giá: ' + err.message);
            }
        }
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

    if (discountVariants.length === 0) {
        return <div className={cx('empty')}>Không có biến thể nào được giảm giá</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div>
                <button onClick={handleback} className={cx('btn__back')}>
                    {' '}
                    <FontAwesomeIcon icon={faAngleLeft} /> Quay lại
                </button>
                <h1 className={cx('title')}>Danh sách biến thể được giảm giá</h1>
            </div>

            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>% Giảm giá</th>
                        <th>Kích thước</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {discountVariants.map((variant) => (
                        <tr key={variant.id}>
                            <td>{variant.productName}</td>
                            <td>{variant.discountPercent}%</td>
                            <td>{variant.size}</td>
                            <td>{new Date(variant.startDate).toLocaleDateString()}</td>
                            <td>{new Date(variant.endDate).toLocaleDateString()}</td>
                            <td>
                                <button className={cx('delete-button')} onClick={() => handleDelete(variant.id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListDiscountVariant;
