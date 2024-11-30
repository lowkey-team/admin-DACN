import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import classNames from 'classnames/bind';
import styles from './ModalAddNewSupplier.module.scss';
import { addNewSupplierAPI } from '~/apis/supplier';

const cx = classNames.bind(styles);

function ModalAddNewSupplier({ visible, onCancel, onAddSupplier }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    console.log("Dữ liệu gửi đi:", values);
    setLoading(true); 

    try {
      const response = await addNewSupplierAPI(values);

      if (response.status === 200) {
        onAddSupplier(response.data);

        form.resetFields();

        message.success('Nhà cung cấp đã được thêm thành công!');
      } else {
        throw new Error('Không thể thêm nhà cung cấp.');
      }
    } catch (error) {
      console.error('Lỗi khi thêm nhà cung cấp:', error);
      message.error(error.message || 'Đã xảy ra lỗi, vui lòng thử lại!');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Modal
      title="Thêm mới nhà cung cấp"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      className={cx('modal-container')}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit} 
      >
        <Form.Item
          label="Tên nhà cung cấp"
          name="SupplierName"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="Email"
          rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Người liên hệ"
          name="contactPerson"
          rules={[{ required: true, message: 'Vui lòng nhập người liên hệ' }]}
        >
          <Input placeholder="Nhập người liên hệ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalAddNewSupplier;
