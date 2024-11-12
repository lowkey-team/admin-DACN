// ProductFilters.js
import React from 'react';
import { Input, Row as AntRow, Col, Select, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function ProductFilters({
    searchTerm,
    setSearchTerm,
    categories,
    selectedCategories,
    setSelectedCategories,
    subcategories,
    selectedSubcategories,
    setSelectedSubcategories,
    rowsPerPage,
    setRowsPerPage,
}) {
    return (
        <AntRow gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col span={8}>
                <Input
                    placeholder="Tìm kiếm sản phẩm theo tên"
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Col>
            <Col span={14}>
                <AntRow gutter={16}>
                    <Col>
                        <Select
                            style={{ minWidth: 150 }}
                            mode="multiple"
                            placeholder="Tên danh mục"
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                            allowClear
                            maxTagCount={2}
                            maxTagPlaceholder={(omittedValues) => {
                                console.log('Omitted Values:', omittedValues);
                                return (
                                    <Tooltip title={omittedValues.map((item) => item.label).join(', ')}>
                                        <span>{`${omittedValues.length} ...`}</span>
                                    </Tooltip>
                                );
                            }}
                        >
                            {categories.map((category) => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            style={{ minWidth: 150 }}
                            mode="multiple"
                            placeholder="Danh mục con"
                            value={selectedSubcategories}
                            onChange={setSelectedSubcategories}
                            allowClear
                            maxTagCount={2}
                            maxTagPlaceholder={(omittedValues) => {
                                console.log('Omitted Values:', omittedValues);
                                return (
                                    <Tooltip title={omittedValues.map((item) => item.label).join(', ')}>
                                        <span>{`${omittedValues.length} ...`}</span>
                                    </Tooltip>
                                );
                            }}
                        >
                            {Object.entries(subcategories).map(([category, subs]) =>
                                selectedCategories.includes(category)
                                    ? subs.map((subcategory) => (
                                          <Option key={subcategory} value={subcategory}>
                                              {subcategory}
                                          </Option>
                                      ))
                                    : null,
                            )}
                        </Select>
                    </Col>
                </AntRow>
            </Col>
            <Col span={2}>
                <Select defaultValue={rowsPerPage} onChange={setRowsPerPage} style={{ width: '100%' }}>
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                </Select>
            </Col>
        </AntRow>
    );
}
