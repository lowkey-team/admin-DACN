import React, { useState } from "react";
import { Modal } from "antd";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("login-container")}>
        <div className={cx("logo")}>
          <img
            src="https://picsum.photos/300/300"
            alt="Logo"
          />
        </div>
        <h2 className={cx("title")}>Chào mừng</h2>
        <form className={cx("form")} onSubmit={handleSubmit}>
          <div className={cx("input-group")}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div className={cx("input-group")}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button type="submit" className={cx("login-button")}>
            Đăng Nhập
          </button>
        </form>
        <div className={cx("footer")}>
          <a href="/forgot-password">Quên mật khẩu?</a>
        </div>
      </div>

      <Modal
        title="Thông báo"
        open={isModalOpen}
        footer={null} 
        closable={false}
      >
        <p>Đăng nhập thành công! Chào mừng bạn.</p>
      </Modal>
    </div>
  );
}

export default Login;
