import { observable, action } from 'mobx';
import { message } from 'antd';
import Ajax from '../libs/ajax';
import API from '../libs/api';

export default class ListStore {
    @observable templateTypeList = [];
    @observable commonTemplateList = [];
    @observable myTemplateList = [];
    @observable myPageList = [];
    @observable commonTemplateFormData = {
        orderByField: {
            name: 'orderByField',
            value: 'gmt_modify'
        },
        dateRange: {
            name: 'dateRange',
            value: {}
        },
        nameLike: {
            name: 'nameLike',
            value: ''
        },
        orderByDirection: {
            name: 'orderByDirection',
            value: 'desc'
        }
    }
    @observable myTemplateFormData = {
        orderByField: {
            name: 'orderByField',
            value: 'gmt_modify'
        },
        dateRange: {
            name: 'dateRange',
            value: {}
        },
        nameLike: {
            name: 'nameLike',
            value: ''
        },
        orderByDirection: {
            name: 'orderByDirection',
            value: 'desc'
        }
    }
    @observable myPageFormData = {
        orderByField: {
            name: 'orderByField',
            value: 'gmt_modify'
        },
        dateRange: {
            name: 'dateRange',
            value: {}
        },
        nameLike: {
            name: 'nameLike',
            value: ''
        },
        orderByDirection: {
            name: 'orderByDirection',
            value: 'desc'
        }
    }
    @observable commonTemplateCfg = {
        pageSize: 20,
        pageNo: 1,
        total: 0
    }
    @observable myTemplateCfg = {
        pageSize: 20,
        pageNo: 1,
        total: 0
    }
    @observable myPageCfg = {
        pageSize: 20,
        pageNo: 1,
        total: 0
    }
    @observable templateLoading = true;

    constructor() {
        this.lastFetchId = 1;
    }

    async getTemplateTypeList(config) {
        Ajax.get(API.template.typeList, {
            params: config
        }).then(res => {
            if (res.status) {
                this.setTemplateTypeList(res.entry);
            } else {
                message.error(res.message || '模板类型查询失败！');
            }
        }).catch(error => {
            message.error(error.message || '模板类型查询失败！');
        });
    }

    async getTemplateList(config) {
        const fetchId = this.lastFetchId + 1;
        this.lastFetchId = fetchId;
        this.setTemplateLoading(true);

        Ajax.get(API.template.list, {
            params: config
        }).then(res => {
            if (fetchId !== this.lastFetchId) return;
            this.setTemplateLoading(false);
            if (res.status) {
                let type = config.organizeId === -1 ? 1 : (config.kaCommon === 1 ? 2 : 3 )
                this.setTemplateList(type, res.entry.list);
                this.setPaginationCfg(type, {
                    pageSize: config.size,
                    pageNo: config.currentPage,
                    total: res.entry.allRow || 0
                });
            } else {
                message.error(res.message || '模板列表查询失败！');
            }
        }).catch(error => {
            this.setTemplateLoading(false);
            message.error(error.message || '模板列表查询失败！');
        });;
    }

    /**
     * 
     * 设置分页数据
     * @param {Number} type 1表示官方模板，2表示我的模板，3表示我的页面
     * @param {Object} data 分页参数
     * @memberof ListStore
     */
    @action setPaginationCfg(type, data) {
        if (type === 1) {
            this.commonTemplateCfg = Object.assign({}, this.commonTemplateCfg, data);
        } else if (type === 2) {
            this.myTemplateCfg = Object.assign({}, this.myTemplateCfg, data);
        } else {
           this.myPageCfg = Object.assign({}, this.myPageCfg, data);
        }
    }


    /**
     * 
     * 设置搜索表单数据
     * @param {Number} type 1表示官方模板，2表示我的模板，3表示我的页面
     * @param {Object} data 分页参数
     * @memberof ListStore
     */
    @action seFormData(type, data) {
        if (type === 1) {
            this.commonTemplateFormData = Object.assign({}, this.commonTemplateFormData, data);
        } else if (type === 2) {
            this.myTemplateFormData = Object.assign({}, this.myTemplateFormData, data);
        } else {
           this.myPageFormData = Object.assign({}, this.myPageFormData, data);
        }
    }

    /**
     * 
     * 
     * @param {Object} data 模板类型列表
     * @memberof ListStore
     */
    @action setTemplateTypeList(data) {
        const defaultTagList = [{
            name: '全部风格',
            code: ''
        }];
        this.templateTypeList = defaultTagList.concat(data);
    }

    /**
     * 
     * 
     * @param {Number} type -1表示官方模板，2表示我的模板，3表示我的页面
     * @param {Object} data 模板列表
     * @memberof ListStore
     */
    @action setTemplateList(type, data) {
        if (type === 1) {
            this.commonTemplateList = data;
        } else if (type === 2) {
            this.myTemplateList = data;
        } else {
            this.myPageList = data;
        }
    }

    @action setTemplateLoading(loading) {
        this.templateLoading = loading;
    }
}