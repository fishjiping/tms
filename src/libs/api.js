import { HOST } from './util';

const API =  {
    img: {
        // 图片上传
        upload: `${HOST}/sp/upload/new`
    },
    
    template: {
        // 新建/保存模板
        save: `${HOST}/baohe/kacrm/tms/saveTemplate.json`,
        // 删除模板
        delete: `${HOST}/baohe/kacrm/tms/delTemplate.json`,
        // 复制模板
        copy: `${HOST}/baohe/kacrm/tms/copyTemplate.json`,
        // 模板列表
        list: `${HOST}/baohe//kacrm/tms/listTemplate.json`,
        // 模板详情
        detail: `${HOST}/baohe/kacrm/tms/queryTemplateById.json`,
        // 模板类型
        typeList: `${HOST}/baohe/kacrm/tms/templateTypes.json`,
        // 发布模板
        publish: `${HOST}/baohe/kacrm/tms/publishTemplateToOss.json`
    },

    module: {
        // 新建/保存模块
        save: `${HOST}/baohe/kacrm/tms/saveModule.json`,
        // 删除模块
        delete: `${HOST}/baohe/kacrm/tms/delModule.json`,
        // 模块列表
        list: `${HOST}/baohe/kacrm/tms/listModule.json`,
        // 模块详情
        detail: `${HOST}/baohe/kacrm/tms/queryModuleById.json`,
        // 模块类型
        typeList: `${HOST}/baohe/kacrm/tms/moduleTypes.json`
    },

    coupon: {
        // 优惠券列表
        list: `${HOST}/market/api/hongbao/list_sets.json`
    },

    activity: {
        // 更新活动有效期
        updateTime: `${HOST}/market/ka/common_set/batchModifyActDate.json`
    },

    item: {
        // 导入活动商品
        upload: `${HOST}/market/importTask/saveCommonActThenImport.json`,
        // 导入活动商品进度
        uploadProgress: `${HOST}/market/importTask/queryProgress`,
        // 导入活动商品结果
        uploadResult: `${HOST}/market/importTask/list`,
        // 查询商品列表或者删除指定条件商品列表，通过isDeleteOption字段区分
        list: `${HOST}/market/ka/common_set/entity_list.json`,
        // 按商品id单个删除接口
        delete: `${HOST}/market/ka/common_set/delete_entity.json`,
        // 按商品ids批量删除接口
        batchDelete: `${HOST}/market/ka/common_set/delete_entity_list.json`,
        // 修改商品排序码
        sort: `${HOST}/market/ka/common_set/updateSortNum.json`
    }
};

export default API;