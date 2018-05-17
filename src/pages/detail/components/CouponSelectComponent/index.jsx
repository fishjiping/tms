import React from 'react';
import { Button, Input, message, Modal, Table } from 'antd';
import { ORGANIZE_ID } from '../../../../libs/util';
import Ajax from '../../../../libs/ajax';
import API from '../../../../libs/api';
import './index.less';

const Search = Input.Search;

export default class CouponSelectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.selectedCouponList = props.selectedCouponList;
        const selectedCouponKeys = props.selectedCouponList.map((coupon, i) => {
            return coupon.id;
        });

        this.state = {
            selectedCouponKeys: selectedCouponKeys,
            couponList: [],
            visible: false,
            loading: true,
            pagination:{
                pageSize: '',
                total: '',
                current: 1,
            }
        };
        
    }

    // 数据列表 页码
    handleTableChange = (pagination) => {
        this.getCouponList({ pageNo: pagination.current });
    }

    handleAddCoupon = () => {
        this.setState({ visible: false });
        const countList = this.selectedCouponList.map((coupon, i) => {
            return {
                id: coupon.id,
                amount: coupon.amount
            }
        });
        this.props.onAddCoupon(countList);
    }
    
    showModal = () => {
        this.setState({ visible: true });
        this.getCouponList({});
    }

    hideModal = () => {
        // 还原到之前选择的优惠券
        const { selectedCouponList } = this.props
        this.selectedCouponList = selectedCouponList;
        const selectedCouponKeys = selectedCouponList.map((coupon, i) => {
            return coupon.id;
        });
        this.setState({ visible: false, selectedCouponKeys });
    }

    getCouponList = (config) => {
        this.setState({ loading: true });

        const params = Object.assign({
            organizeId: ORGANIZE_ID,
            pageNo: 1,
            filter: true,
            withOutSmart: true,
            selector: true
        }, config);

        Ajax.get(API.coupon.list, { params: params }).then(res => {
            if (res.status) {
                this.setState({
                    loading: false,
                    couponList: res.entry.list,
                    pagination: { 
                        total: res.entry.totalCount,
                        pageSize: res.entry.pageSize,
                        current: res.entry.pageNo
                    }
                });
            } else {
                this.setState({ loading: false });
                message.error(res.message || '优惠券查询失败！');
            }
        })
        .catch(error => {
            this.setState({ loading: false });
            message.error(error.message || '优惠券查询失败！');
        })
    }

    componentWillReceiveProps(nextProps) {
        this.selectedCouponList = nextProps.selectedCouponList;
        const selectedCouponKeys = nextProps.selectedCouponList.map((coupon, i) => {
            return coupon.id;
        });
        this.setState({ selectedCouponKeys });
    }

    get columns() {
        return [
            {
                title: '券 ID',
                dataIndex: 'id',
                key: 'id',
                width: '80px'
            },
            {
                title: '活动名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '活动时间',
                key: 'startTime',
                render: (text, record) => {
                    return (
                        <div>
                            <p>开始：</p>
                            <p>{record.startTime}</p>
                            <p>结束：</p>
                            <p>{record.endTime}</p>
                        </div>
                    );
                }
            },
            {
                title: '券金额(元)',
                dataIndex: 'amount',
                key: 'amount',
                width: '100px',
                render: (text, record) => {
                    return (
                        <div>{record.amount / 100}</div>
                    );
                }
            },
            {
                title: '发放/领取数量',
                key: 'num',
                render: (text, record) => {
                    return (
                        <div>
                            <p>发放数量：{record.sumNum}</p>
                            <p>每人每天可领取数量：{record.dayNum}</p>
                            <p>每人总领取量{record.userSumNum}</p>
                        </div>
                    );
                }
            },
            {
                title: '券有效期',
                dataIndex: 'effective',
                key: 'effective',
                render: (text, record) => {
                    let htmlText = '固定有效期：',htmlTime = '';
                    if (record.fixedExpired) {
                        htmlText = '动态生成有效期：';
                        htmlTime = '间隔 ' + record.startExpired + ' 天' + '有效期 ' + record.expiredLength + ' 天';
                    } else {
                        htmlTime = record.startTime + ' 至 ' + record.endTime;
                    }
                    return (
                        <div>
                            <p>{htmlText}</p>
                            <p>{htmlTime}</p>
                        </div>
                    );
                }
            }
        ];
    }

    get rowSelection() {
        return {
            selectedRowKeys: this.state.selectedCouponKeys,
            hideDefaultSelections: true,
            onChange: (selectedRowKeys, selectedRows) => {
                if (selectedRowKeys.length > 8) {
                    message.warn('最多只能添加8张优惠券！');
                } else {
                    this.selectedCouponList = selectedRows;
                    this.setState({ selectedCouponKeys: selectedRowKeys});
                }
            }
        }
    }

    get modalConfig() {
        const { visible } = this.state;
        return {
            className: "coupon-select-container",
            visible: visible,
            width: 1000,
            maskClosable: true,
            title: "选择优惠券",
            okText: "确定",
            onCancel: this.hideModal,
            onOk: this.handleAddCoupon
        }
    }
    
    render() {
        const {
            couponList,
            visible,
            loading,
            pagination,
        } = this.state;

        return (
            <div>
                <Button onClick={this.showModal} >添加优惠券</Button>
                <Modal {...this.modalConfig}>
                    <div className="couponSearch">
                        <Search
                            placeholder="输入优惠券 ID 或活动名称可进行快速搜索"
                            style={{ height: 30 }}
                            onSearch={
                                value => {
                                    const val = value.trim();
                                    // 数字按优惠券id搜索，其他按名称搜索
                                    if (isNaN(val)) {
                                        this.getCouponList({ pName: encodeURIComponent(val) });
                                    } else {
                                        this.getCouponList({ pId: val })
                                    }
                                }
                            }
                        />
                    </div>
                    <Table
                        dataSource = {couponList}
                        columns={this.columns}
                        rowSelection = {this.rowSelection}
                        rowClassName={
                            (record, index) => {
                                return index % 2 === 1 ? 'highlight' : '';
                            }
                        }
                        style = {{ marginTop: 20 }}
                        rowKey="id"
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        loading={loading}
                    >
                    </Table>
                </Modal>
            </div>
        );
    }
}