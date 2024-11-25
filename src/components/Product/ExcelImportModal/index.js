import React, { useState } from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { importProductAPI } from '~/apis/ProductAPI';

const ExcelImportModal = ({ isModalVisible, handleOk, handleCancel }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (info) => {
        if (info.fileList.length > 0) {
            setFile(info.fileList[0].originFileObj);
        } else {
            setFile(null);
        }
    };

    const handleImport = async () => {
        if (!file) {
            message.error('Vui lòng chọn một file trước khi nhập!');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const binaryStr = e.target.result;
            const wb = XLSX.read(binaryStr, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws);

            const formattedData = data.map((item) => ({
                productName: item['productName'],
                ID_SupCategory: item['D_SupCategory'],
                description: item['description'],
                images: item['images'] ? item['images'].split(',') : [],
                variants: item['variants']
                    ? item['variants'].split(',').map((variant) => {
                          const [size, price, stock] = variant.split('-');
                          return {
                              size,
                              Price: parseFloat(price),
                              stock: parseInt(stock, 10),
                          };
                      })
                    : [],
            }));
            console.log('du lieu import excel', formattedData);
            try {
                const response = await importProductAPI(formattedData);
                if (response.success) {
                    message.success('Nhập dữ liệu thành công!');
                    handleOk();
                } else {
                    message.error('Có lỗi xảy ra khi nhập dữ liệu!');
                }
            } catch (error) {
                message.error('Lỗi kết nối đến API!');
            }
        };

        reader.readAsBinaryString(file);
    };

    return (
        <Modal
            title="Chọn file Excel"
            visible={isModalVisible}
            onOk={handleImport}
            onCancel={handleCancel}
            okText="Nhập"
            cancelText="Hủy"
            width={400}
        >
            <Upload beforeUpload={() => false} onChange={handleFileChange} accept=".xlsx, .xls" showUploadList={false}>
                <Button icon={<FontAwesomeIcon icon={faFileExcel} />} style={{ width: '100%' }}>
                    Chọn file
                </Button>
            </Upload>
        </Modal>
    );
};

export default ExcelImportModal;
