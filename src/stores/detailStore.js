import { observable, action } from 'mobx';
import { message } from 'antd';
import moment from 'moment';
import Ajax from '../libs/ajax';
import API from '../libs/api';
import { HOST } from '../libs/util';

const startDate = moment().format('YYYY-MM-DD');
const endDate = moment().add(1, 'd').format('YYYY-MM-DD');

export default class ListStore {
    @observable moduleTagList = [];
    @observable moduleList = [];
    @observable moduleLoading = true;
    @observable templateLoading = true;
    @observable templateConfig = [];
    @observable templateGlobleConfig = {
        name: '',
        backgroundColor: '#fff',
        backgroundImage: '',
        startDate: `${startDate} 00:00:00`,
        endDate: `${endDate} 00:00:00`,
        hasBackTopBtn: true,
        hasCartBtn: true
    };

    constructor() {
        this.templateId = '';
    }

    async getTemplateDetail(config) {
        Ajax.get(API.template.detail, {
            params: config
        }).then(res => {
            this.setTemplateLoading(false);
            if (res.status) {
                const data = res.entry;
                if (data.frontendAttrs) {
                    const tplConfig = JSON.parse(data.frontendAttrs);
                    const { module, ...globalConfig } = tplConfig;

                    this.updateModule(-1, {
                        name: data.name,
                        startDate: data.startDate || this.templateGlobleConfig.startDate,
                        endDate: data.endDate || this.templateGlobleConfig.endDate,
                        ...globalConfig
                    })

                    this.templateConfig = module || [];
                }
            } else {
                message.error(res.message || '模板查询失败！');
            }
        }).catch(error => {
            this.setTemplateLoading(false);
            message.error(error.message || '模板查询失败！');
        });
    }

    async getModuleList(config) {
        this.setModuleLoading(false);

        Ajax.get(API.module.list, {
            params: config
        }).then(res => {
            this.setModuleLoading(false);
            if (res.status) {
                this.setModuleList(res.entry.list || []);
            } else {
                message.error(res.message || '模块列表查询失败');
            }
        }).catch(error => {
            this.setModuleLoading(false);
            message.error(error.message || '模块列表查询失败');
        });
    }

    async getModuleTagList(config) {
        Ajax.get(API.module.typeList, {
            params: config
        }).then(res => {
            if (res.status) {
                this.setModuleTagList(res.entry);
            } else {
                message.error(res.message || '模块类型查询失败！');
            }
        }).catch(error => {
            message.error(error.message || '模块类型查询失败！');
        });
    }

    @action setModuleLoading(loading) {
        this.moduleLoading = loading;
    }

    @action setTemplateLoading(loading) {
        this.templateLoading = loading;
    }
    
    /**
     * 
     * 设置模板id
     * @param {Number} id 模板id
     * @memberof ListStore
     */
    @action setTemplateId(id) {
        this.templateId = id;
    }

    /**
     * 
     * 设置模块列表
     * @param {Array} data 模块列表
     * @memberof ListStore
     */
    @action setModuleList(data) {
        this.moduleList = data;
    }

    /**
     * 
     * 设置模块类型列表
     * @param {Array} data 模块类型列表
     * @memberof ListStore
     */
    @action setModuleTagList(data) {
        let defaultTagList = [
            {
                name: '全部组件',
                code: ''
            }
        ];
        this.moduleTagList = defaultTagList.concat(data);
    }

    /**
     * 
     * 添加模块数据
     * @param {Object} data 模块数据
     * @memberof ListStore
     */
    @action addModule(data) {
        this.templateConfig.push(data);
    }
    /**
     * 
     * 删除指定模块数据
     * @param {String} uid 模块唯一id，前端拖拽模块到模板时生成
     * @memberof ListStore
     */
    @action deleteModule(uid) {
        let index;
        this.templateConfig.forEach((item, i) => {
            if (item.baseInfo.uid === uid) {
                index = i;
            }
        })
        this.templateConfig.splice(index, 1);
    }

    /**
     * 
     * 移动模块数据
     * @param {Number} start 移动开始位置
     * @param {Number} end 移动结束位置
     * @memberof ListStore
     */
    @action moveModule(start, end) {
		const config = JSON.parse(JSON.stringify(this.templateConfig));
		const dragData = config.splice(start, 1)[0];
		config.splice(end , 0, dragData);
        this.templateConfig = config;
    }

    /**
     * 
     * 更新指定模块数据
     * @param {String} uid 模块唯一id，前端拖拽模块到模板时生成
     * @param {Object} data 模块更新数据
     * @memberof ListStore
     */
    @action updateModule(uid, data) {
            // 全局模块
        if (uid === -1) {
            this.templateGlobleConfig = Object.assign({}, this.templateGlobleConfig, data);
        } else {
            this.templateConfig.forEach((item, i) => {
                if (item.baseInfo.uid === uid) {
                    item.data = Object.assign({}, item.data, data);
                }
            });
        }
    }
}