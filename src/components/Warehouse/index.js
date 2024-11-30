import classNames from 'classnames/bind';
import styles from './Warehouse.module.scss';

const cx = classNames.bind(styles);

function Warehouse() {
    return (
        <div className={cx('wrapper', 'container-fill')}>
            <main className={cx('main')}>
                <section className={cx('form-section')}>
                    <h2>Thông tin nhập kho sản phẩm</h2>
                    <form className={cx('warehouse-form')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="orderSupplierId">Mã đơn hàng nhà cung cấp</label>
                            <input type="text" id="orderSupplierId" placeholder="Nhập mã đơn hàng" />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="productName">Tên sản phẩm</label>
                            <select id="productName">
                                <option value="">Chọn sản phẩm</option>
                                <option value="Bình hoa">Bình hoa</option>
                                <option value="Diều">Diều</option>
                                <option value="Chén">Chén</option>
                                <option value="Tô">Tô</option>
                            </select>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="quantityOrdered">Số lượng đặt</label>
                            <input type="number" id="quantityOrdered" placeholder="Nhập số lượng đặt" />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="unitPrice">Đơn giá</label>
                            <input type="number" id="unitPrice" placeholder="Nhập đơn giá" />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="importQuantity">Số lượng nhập</label>
                            <input type="number" id="importQuantity" placeholder="Nhập số lượng nhập" />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="supplier">Nhà cung cấp</label>
                            <select id="supplier">
                                <option value="">Chọn nhà cung cấp</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="orderDate">Ngày đặt hàng</label>
                            <input type="date" id="orderDate" />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="dateOfReceipt">Ngày nhận</label>
                            <input type="date" id="dateOfReceipt" />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="notes">Ghi chú</label>
                            <textarea id="notes" placeholder="Thêm ghi chú"></textarea>
                        </div>
                        <div className={cx('form-actions')}>
                            <button type="submit" className={cx('btn-save')}>Lưu</button>
                            <button type="reset" className={cx('btn-clear')}>Xóa tất cả</button>
                        </div>
                    </form>
                </section>

                <section className={cx('table-section')}>
                    <h2>Danh sách nhập kho gần đây</h2>

                    {/* Thanh tìm kiếm */}
                    <div className={cx('search-section')}>
                        <input
                            type="text"
                            id="search"
                            className={cx('search-input')}
                            placeholder="Tìm kiếm sản phẩm..."
                        />
                        <button className={cx('btn-search')}>
                            Tìm kiếm
                        </button>
                    </div>
                    

                    <table className={cx('inventory-table')}>
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Loại</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Nhà cung cấp</th>
                                <th>Ngày nhập</th>
                                <th>Tổng giá trị</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>SP001</td>
                                <td>Bình Gốm Hoa Văn</td>
                                <td>Gốm sứ</td>
                                <td>10</td>
                                <td>500,000</td>
                                <td>Công ty ABC</td>
                                <td>2024-11-28</td>
                                <td>5,000,000</td>
                                <td>
                                    <button className={cx('btn-edit')}>Sửa</button>
                                    <button className={cx('btn-delete')}>Xóa</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}

export default Warehouse;
