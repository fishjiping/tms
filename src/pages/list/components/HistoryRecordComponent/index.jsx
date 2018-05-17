import React from 'react';
import { Icon, Input, message, Modal, Table } from 'antd';
import moment from 'moment';
import { ORGANIZE_ID } from '../../../../libs/util';
import Ajax from '../../../../libs/ajax';
import API from '../../../../libs/api';
import Topic from '../../../../components/Topic';
import './index.less';

export default class HistoryRecordComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            loading: true,
            list: [],
            pagination:{
                pageSize: 30,
                total: '',
                current: 1
            }
        };
    }
    
    showModal = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ visible: true });
        this.getHistoryRecordList({});
    }

    hideModal = () => {
        this.setState({ visible: false });
    }

    // 数据列表页码
    handleTableChange = (pagination) => {
        this.getHistoryRecordList({ curPage: pagination.current });
    }

    getHistoryRecordList = (config) => {
        this.setState({ loading: true });

        const { id } = this.props;
        const { pageSize } = this.state.pagination;
        const params = Object.assign({
            organizeId: ORGANIZE_ID,
            tableSuffix: '_oper_record',
            tplId: id,
            curPage: 1
        }, config);

        Ajax.get(API.template.list, { params: params }).then(res => {
            if (res.status && res.entry) {
                this.setState({
                    loading: false,
                    list: res.entry.list,
                    pagination: { 
                        total: res.entry.allRow,
                        pageSize: res.entry.pageSize,
                        current: res.entry.currentPage
                    }
                });
            } else {
                this.setState({ loading: false });
                message.error(res.message || '操作记录查询失败！');
            }
        })
        .catch(error => {
            this.setState({ loading: false });
            message.error(error.message || '操作记录查询异常！');
        })
    }

    get columns() {
        const columns = [
            {
                title: '操作者',
                dataIndex: 'modifyUserNick',
                key: 'modifyUserNick',
                width: 150
            },
            {
                title: '操作时间',
                dataIndex: 'gmtModify',
                key: 'gmtModify',
                width: 250,
                render: (text, record) => {
                    return moment(text).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                title: '备注',
                dataIndex: 'operComment',
                key: 'operComment',
                render: (text, record) => {
                    return text || '';
                }
            },
            {
                title: '操作',
		        width: 120,
                render: (text, record) => {
                    return <a href={`./detail.html?id=${record.tplId}&operRecordId=${record.id}`} target="_blank">回溯</a>;
                }
            }
        ];

        return columns;
    }

    get modalConfig() {
        const { visible } = this.state;
        return {
            className: "history-record-container",
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
            list,
            loading,
            pagination
        } = this.state;

        return (
            <span className="copy-btn" onClick={this.showModal}>
                <Icon type="clock-circle-o" />
                <span>操作记录</span>
                <Modal {...this.modalConfig}>
                    <Topic title={'操作记录'} />
                    <Table
                        dataSource = {list}
                        columns={this.columns}
                        rowClassName={
                            (record, index) => {
                                return index % 2 === 1 ? 'highlight' : '';
                            }
                        }
                        style = {{ marginTop: 40 }}
                        rowKey="id"
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        loading={loading}
                    ></Table>
                </Modal>
            </span>
        );
    }
}