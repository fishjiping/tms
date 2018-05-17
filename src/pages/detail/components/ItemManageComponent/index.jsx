import React from 'react';
import { Button, Input, message, Modal, Table } from 'antd';
import moment from 'moment';
import { ORGANIZE_ID, debounce } from '../../../../libs/util';
import Ajax from '../../../../libs/ajax';
import API from '../../../../libs/api';
import Topic from '../../../../components/Topic';
import SearchForm from './SearchForm';
import './index.less';

export default class ItemManageComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemType: props.itemType,
            selectedItemKeys: [],
            itemList: [],
            visible: false,
            loading: true,
            pagination:{
                pageSize: '',
                total: '',
                current: 1
            }
        };
        this.shopId = '';
        this.barcode = '';
    }
    
    showModal = () => {
        if (this.props.activityId) {
            this.setState({ visible: true });
            this.getItemList({});
        } else {
            message.info('请先导入商品！');
        }
    }

    hideModal = () => {
        this.form.setFieldsValue({
            barcode: '',
            shopId: ''
        });
        this.shopId = '';
        this.barcode = '';
        this.setState({ 
            visible: false,
            selectedItemKeys: []
        });
    }

    // 数据列表页码
    handleTableChange = (pagination) => {
        this.getItemList({ 
            curPage: pagination.current, 
            barCode: this.barcode, 
            shopId: this.shopId
        });
    }

    handleFormSubmit = (data) => {
        this.barcode = data.barcode;
        this.shopId = data.shopId;
		this.getItemList({
            barCode: data.barcode,
            shopId: data.shopId
        });
    }

    /**
     * 按商品id批量删除商品
     * @memberof ItemManageComponent
     */
    handleDeleteItemByIds = () => {
        const { selectedItemKeys, itemList } = this.state;
        
        Ajax.get(API.item.batchDelete, { 
            params: {
                ids: selectedItemKeys.join(),
                activityId: this.props.activityId
            } 
        }).then(res => {
            if (res.status) {
                const filterList = itemList.filter((item) => {
                    return !selectedItemKeys.includes(item.id);
                });
                this.setState({ itemList: filterList, selectedItemKeys: [] });
            } else {
                message.error(res.message || '商品删除失败！');
            }
        })
        .catch(error => {
            message.error(error.message || '商品删除失败！');
        })
    }

    /**
     * 
     * 单个删除商品接口
     * @param {Number} id 商品id 
     */
    handleDeleteItemById = (id) => {
        const { selectedItemKeys, itemList } = this.state;
        
        Ajax.get(API.item.delete, { 
            params: {
                id: id,
                activityId: this.props.activityId
            } 
        }).then(res => {
            if (res.status) {
                const filterList = itemList.filter((item) => {
                    return item.id !== id;
                });
                const filterSelectedItemKeys = selectedItemKeys.filter((itemId) => {
                    return itemId !== id;
                });
                this.setState({ itemList: filterList, selectedItemKeys: filterSelectedItemKeys });
            } else {
                message.error(res.message || '商品删除失败！');
            }
        })
        .catch(error => {
            message.error(error.message || '商品删除失败！');
        })
    }
    
    /**
     * 
     * 指定条件删除所有商品，如店铺或者条码
     * @memberof ItemManageComponent
     */
    handleDeleteItemByOption = () => {
        Ajax.get(API.item.list, { 
            params: {
                organizeId: ORGANIZE_ID,
                activityId: this.props.activityId,
                promotionType: 'common_set_tms',
                barCode: this.barcode,
                shopId: this.shopId,
                isDeleteOption: true
            } 
        }).then(res => {
            if (res.status) {
                this.setState({
                    itemList: [],
                    pagination: { 
                        total: 0,
                        pageSize: 20,
                        current: 1
                    }
                });
            } else {
                this.setState({ loading: false });
                message.error(res.message || '商品查询失败！');
            }
        })
        .catch(error => {
            this.setState({ loading: false });
            message.error(error.message || '商品查询失败！');
        })
    }

    handleChangeSortNum = (e, id) => {
        const { itemList } = this.state;
        const sortNum = e.target.value;
        let  oldSortNum;
        const list = itemList.map((item, i) => {
            if (item.id === id) {
                oldSortNum = item.sortNum;
                item.sortNum = sortNum;
            }
            return item;
        });

        this.setState({ itemList: list });

        const updateSortNum = debounce(() => {
            this.updateSortNum(id, sortNum, oldSortNum);
        }, 500);
        updateSortNum();
    }

    /**
     * 
     * 
     * @param {Number} id 活动商品记录的主键id
     * @param {Number} newSortNum 新的排序码
     * @param {Number} oldSortNum 老的排序码
     */
    updateSortNum = (id, newSortNum, oldSortNum) => {
        if (!id || !newSortNum) return;
        Ajax.get(API.item.sort, { 
            params: {
                entityId: id,
                sortNum: newSortNum
            } 
        }).then(res => {
            if (!res.status) {
                const list = this.state.itemList.map((item, i) => {
                    if (item.id === id) {
                        item.sortNum = oldSortNum;
                    }
                    return item;
                });
                this.setState({ itemList: list });
                message.error(res.message || '排序码更新失败！');
            }
        })
        .catch(error => {
            message.error(error.message || '排序码更新失败！');
        })
    }

    getItemList = (config) => {
        this.setState({ loading: true });

        const params = Object.assign({
            organizeId: ORGANIZE_ID,
            activityId: this.props.activityId,
            promotionType: 'common_set_tms',
            curPage: 1
        }, config);

        Ajax.get(API.item.list, { params: params }).then(res => {
            if (res.status && res.entry) {
                this.setState({
                    loading: false,
                    itemList: res.entry,
                    pagination: { 
                        total: res.pageSet.allRow,
                        pageSize: res.pageSet.pageSize,
                        current: res.pageSet.currentPage
                    }
                });
            } else {
                this.setState({ loading: false });
                message.error(res.message || '商品查询失败！');
            }
        })
        .catch(error => {
            this.setState({ loading: false });
            message.error(error.message || '商品查询失败！');
        })
    }

    get columns() {
        const columns = [
            {
                title: '商品图',
                dataIndex: 'imgUrl',
                key: 'imgUrl',
                render: (text, record) => {
                     return <img src={`//imgsize.52shangou.com/img/${text}@80w`} alt={record.name} />;
                }
            },
            {
                title: '商品信息',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                    return (
                        <div>
                            <p className="multi-ellipsis">{record.brand} {text}</p>
                            <p>{record.property} {record.unit}</p>
                        </div>
                    );
                }
            },
            {
                title: 'SPU ID',
                dataIndex: 'spuId',
                key: 'spuId'
            },
            {
                title: '商品条形码',
                dataIndex: 'barcode',
                key: 'barcode'
            },
            {
                title: '店铺 ID',
                dataIndex: 'shopId',
                key: 'shopId'
            },
            {
                title: '排序码',
                dataIndex: 'sortNum',
                key: 'sortNum',
                render: (text, record) => {
                    return <Input 
                        size="default" 
                        value={text} 
                        style={{ width: 90 }}
                        onChange={(e) => {this.handleChangeSortNum(e, record.id)}} 
                    />;
                }
            },
            {
                title: '商品价格',
                dataIndex: 'price',
                key: 'price',
                render: (text, record) => {
                    return <span>{text / 100}</span>;
                }
            },
            {
                title: '商品库存',
                dataIndex: 'quantity',
                key: 'quantity'
            },
            {
                title: '商品状态',
                dataIndex: 'itemStatus',
                key: 'itemStatus'
            },
            {
                title: '操作',
                key: 'operation',
                className: 'column-operation',
                fixed: 'right',
		        width: 85,
                render: (text, record) => {
                    return <a className="delete-btn" href="javascript:;" onClick={() => {this.handleDeleteItemById(record.id)}}>删除</a>;
                }
            }
        ];

        // 秒杀组件特有字段
        if (this.state.itemType === 'secKill') {
            columns.splice(8, 0, {
                title: '活动库存/剩余活动库存',
                key: 'stock',
                render: (text, record) => {
                    const data = record.fullDiscountList ? record.fullDiscountList[0] : null;
                    let presetStock = '/';
                    let surplusStock = '/';

                    if (data) {
                        if (data.presetStock <= 0) {
                            presetStock = '不限';
                        } else {
                            presetStock = data.presetStock;
                        }
                        if (data.remainLimit) surplusStock = data.remainLimit;
                    }

                    return (
                        <div>
                            <p>活动库存：{presetStock}</p>
                            <p>剩余活动库存：{surplusStock}</p>
                        </div>
                    );
                }
            });

            columns.splice(9, 0, {
                title: '活动时间',
                key: 'date',
                render: (text, record) => {
                    const data = record.fullDiscountList ? record.fullDiscountList[0] : null;
                    let startDate = '/';
                    let endDate = '/';
                    let timeRange = '/';

                    if (data) {
                        if (data.beginDate) startDate = moment(data.beginDate).format('YYYY-MM-DD');
                        if (data.endDate) endDate = moment(data.endDate).format('YYYY-MM-DD');
                        if (data.beginTime && data.endTime) timeRange = `${moment(data.beginTime).format('HH:mm')}-${moment(data.endTime).format('HH:mm')}`;
                    }

                    return (
                        <div>
                            <p>开始日期：{startDate}</p>
                            <p>结束日期：{endDate}</p>
                            <p>时间段：{timeRange}</p>
                        </div>
                    );
                }
            });
        }

        return columns;
    }

    get rowSelection() {
        return {
            selectedRowKeys: this.state.selectedItemKeys,
            hideDefaultSelections: true,
            onChange: (selectedRowKeys, selectedRows) => {
                this.selectedCouponList = selectedRows;
                this.setState({ selectedItemKeys: selectedRowKeys});
            }
        }
    }

    get modalConfig() {
        const { visible } = this.state;
        return {
            className: "item-manage-container",
            visible: visible,
            footer: null,
            width: 1000,
            maskClosable: true,
            closable: false,
            onCancel: this.hideModal
        }
    }
    
    render() {
        const {
            itemType,
            selectedItemKeys,
            itemList,
            visible,
            loading,
            pagination
        } = this.state;

        return (
            <div>
                <Button onClick={this.showModal} >查看商品</Button>
                <Modal {...this.modalConfig}>
                    <Topic title={'查看商品'} />
                    <SearchForm ref={(form) => {this.form = form}} onSubmit={this.handleFormSubmit} />
                    <div className="delete-box">
                        <Button 
                            type="primary" 
                            disabled={selectedItemKeys && selectedItemKeys.length === 0 ? true : false} 
                            onClick={this.handleDeleteItemByIds} 
                            style={{ marginRight: 20, height: 24 }}
                        >批量删除</Button>
                        <Button 
                            type="primary" 
                            disabled={!this.shopId && !this.barcode ? true : false} 
                            onClick={this.handleDeleteItemByOption}
                            style={{ height: 24 }}
                        >删除所有</Button>
                    </div>
                    <Table
                        dataSource = {itemList}
                        columns={this.columns}
                        rowSelection = {this.rowSelection}
                        rowClassName={
                            (record, index) => {
                                return index % 2 === 1 ? 'highlight' : '';
                            }
                        }
                        style = {{ marginTop: 10 }}
                        rowKey="id"
                        scroll={{ x: itemType === 'secKill' ? 1500 : 1200 }}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        loading={loading}
                    ></Table>
                </Modal>
            </div>
        );
    }
}