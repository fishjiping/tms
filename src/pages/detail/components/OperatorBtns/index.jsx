import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Input, message, Modal } from 'antd';
import html2canvas from 'html2canvas';
import { HOST, H5_HOST, H5_HOST_HTTPS, ORGANIZE_ID, urlParams, base64toBlob, sleep } from '../../../../libs/util';
import Ajax from '../../../../libs/ajax';
import API from '../../../../libs/api';
import PreviewPopup from '../../../../components/PreviewPopup';
import './index.less';

const confirm = Modal.confirm;

@inject('store')
@observer
export default class OperatorBtns extends React.Component {
	constructor(props) {
		super(props);
        this.store = props.store;
        this.state = {
            saveLoading: false,
            previewLoading: false,
            publishLoading: false,
            saveTemplateLoading: false,
            visible: false,
            url: '',
            qrcodeUrl: '',
            remark: ''
        };
    }
    
    handleSave = async () => {
        try {
            const { saveLoading, remark } = this.state;

            if (saveLoading) return;

            this.setState({ saveLoading: true });

            // 截图生成封面图blob数据
            const coverImgBlob = await this.getCoverImgBlob();

            // 上传封面图
            const uploadResult = await this.uploadCoverImg({ file: coverImgBlob });

            // 上传失败则退出
            if (uploadResult.code !== '0' || !uploadResult.key) {
                this.setState({ saveLoading: false });
                message.error(uploadResult.desc || '上传图片失败！');
                return;
            }

            // 保存模板
            const saveConfig = urlParams.operRecordId ? { operRecordId: urlParams.operRecordId } : {};
            Object.assign(saveConfig, this.templateSaveConfig, { 
                kaCommon: 0, 
                coverImg: uploadResult.key, 
                operComment: remark
            });
            const saveResult = await this.saveTemplate(saveConfig);

            // 保存失败则退出
            if (!saveResult || !saveResult.status) {
                message.error(saveResult.message || '保存失败!'); 
            } else {
                // 新建模板则保存模板id
                if (!this.store.templateGlobleConfig.templateId) {
                    this.store.setTemplateId(saveResult.entry.tplId);
                }
                message.success('保存成功');
            }

            this.setState({ saveLoading: false });
        } catch (e) {
            this.setState({ saveLoading: false });
            message.error(e.message || '保存失败！');
        }
    }

    /**
     * 
     * 预览操作
     * @memberof OperatorBtns
     */
    handlePreview = async () => {
        try {
            const { previewLoading, remark } = this.state;

            if (previewLoading) return;

            this.setState({ previewLoading: true });

            // 截图生成封面图blob数据
            const coverImgBlob = await this.getCoverImgBlob();

            // 生成封面图
            const uploadResult = await this.uploadCoverImg({ file: coverImgBlob });

            // 上传失败则退出
            if (uploadResult.code !== '0' || !uploadResult.key) {
                this.setState({ previewLoading: false });
                message.error(uploadResult.desc || '上传图片失败！');
                return;
            }

            // 保存模板
            const saveConfig = urlParams.operRecordId ? { operRecordId: urlParams.operRecordId } : {};
            Object.assign(saveConfig, this.templateSaveConfig, { 
                kaCommon: 0, 
                coverImg: uploadResult.key, 
                operComment: remark
            });
            const saveResult = await this.saveTemplate(saveConfig);

            // 保存失败则退出
            if (!saveResult || !saveResult.status) {
                this.setState({ previewLoading: false });
                message.error(saveResult.message || '预览失败!'); 
                return;  
            }

            // 新建模板则保存模板id
            if (!this.store.templateGlobleConfig.templateId) {
                this.store.setTemplateId(saveResult.entry.tplId);
            }
            
            // 发布预览页面
            const previewResult = await this.publishTemplate({
                templateId: saveResult.entry.tplId,
                type: 'pre',
                organizeId: ORGANIZE_ID
            });
            if (previewResult && previewResult.status) {
                this.setState({ 
                    visible: true,
                    url: `${H5_HOST_HTTPS + saveResult.entry.pageMap.pre.ossFilePath}?t=${Date.now()}`,
                    qrcodeUrl: `${H5_HOST + saveResult.entry.pageMap.pre.ossFilePath}?t=${Date.now()}`
                });
            } else {
                message.error(saveResult.message || '预览失败!');
            }
            this.setState({ previewLoading: false });
        } catch (e) {
            this.setState({ previewLoading: false });
            message.error(e.message || '预览失败！');
        }
    }

    handlePublic = async () => {
        try {
            const { publishLoading, remark } = this.state;

            if (publishLoading) return;

            this.setState({ publishLoading: true });

            // 截图生成封面图blob数据
            const coverImgBlob = await this.getCoverImgBlob();

            // 生成封面图
            const uploadResult = await this.uploadCoverImg({ file: coverImgBlob });

            // 上传失败则退出
            if (uploadResult.code !== '0' || !uploadResult.key) {
                this.setState({ publishLoading: false });
                message.error(uploadResult.desc || '上传图片失败！');
                return;
            }


            // 保存模板
            const saveConfig = urlParams.operRecordId ? { operRecordId: urlParams.operRecordId } : {};
            Object.assign(saveConfig, this.templateSaveConfig, { 
                kaCommon: 0, 
                coverImg: uploadResult.key,
                operComment: remark 
            });
            const saveResult = await this.saveTemplate(saveConfig);

            // 保存失败则退出
            if (!saveResult || !saveResult.status) {
                this.setState({ publishLoading: false });
                message.error(saveResult.message || '发布失败!'); 
                return;  
            }

            // 新建模板则保存模板id
            if (!this.store.templateGlobleConfig.templateId) {
                this.store.setTemplateId(saveResult.entry.tplId);
            }
            
            // 发布线上页面
            const publishResult = await this.publishTemplate({
                templateId: saveResult.entry.tplId,
                type: 'pub',
                organizeId: ORGANIZE_ID
            });
            if (publishResult && publishResult.status) {
                this.setState({ 
                    visible: true,
                    url: `${H5_HOST_HTTPS + saveResult.entry.pageMap.pub.ossFilePath}?t=${Date.now()}`, 
                    qrcodeUrl: `${H5_HOST + saveResult.entry.pageMap.pub.ossFilePath}?t=${Date.now()}`, 
                });
            } else {
                message.error(publishResult.message || '发布失败!');
            }
            this.setState({ publishLoading: false });
        } catch (e) {
            this.setState({ publishLoading: false });
            message.error(e.message || '发布失败！');
        }
    }

    /**
     * 
     * 
     * @param {Number} id 模板id，存在number类型的参数表示覆盖模板，否则表示保存模板
     * @returns 
     */
    handleSaveTemplate = async (id) => {
        try {
            const { saveTemplateLoading } = this.state;

            if (saveTemplateLoading) return;

            this.setState({ saveTemplateLoading: true });

            // 截图生成封面图blob数据
            const coverImgBlob = await this.getCoverImgBlob();

            // 上传封面图
            const uploadResult = await this.uploadCoverImg({ file: coverImgBlob });

            // 上传失败则退出
            if (uploadResult.code !== '0' || !uploadResult.key) {
                this.setState({ saveTemplateLoading: false });
                message.error(uploadResult.desc || '上传图片失败！');
                return;
            }

            // 保存模板
            const saveConfig = Object.assign({}, this.templateSaveConfig, { kaCommon: 1, coverImg: uploadResult.key });

            if (typeof id === 'number') {
                saveConfig.id = id;
            } else {
                delete saveConfig.id;
            }

            const saveResult = await this.saveTemplate(saveConfig);

            // 保存失败则退出
            if (!saveResult || !saveResult.status) {
                message.error(saveResult.message || '保存模板失败!'); 
            } else if (saveResult.entry && saveResult.entry.commonTplNameExist) {
                confirm({
                    className: 'template-confirm',
                    width: 320,
                    title: '模版名称重复，是否覆盖？',
                    iconType: '',
                    onOk: () => {
                        this.handleSaveTemplate(saveResult.entry.existTplId);
                    }
                });
            } else {
                message.success('保存模板成功');
            }

            this.setState({ saveTemplateLoading: false });
        } catch (e) {
            this.setState({ saveTemplateLoading: false });
            message.error(e.message || '保存模板失败！');
        }
    }

    handleHidePreviewPopup = () => {
        this.setState({ visible: false });
    }

    handleRemarkChange = (e) => {
        const remark = e.target.value.trim();
        this.setState({ remark: remark });
    }

    async getCoverImgBlob() {
        const templateEl = document.querySelector('.template');
        const activeModuleEl = templateEl.querySelector('.tms-module-active');
        let canvasNode;

        if (activeModuleEl) {
            activeModuleEl.classList.remove('tms-module-active');

            canvasNode = templateEl.cloneNode(true);
            canvasNode.style.position = 'absolute';
            canvasNode.style.left = '-9999px';
            canvasNode.style.bottom = '-9999px';
            if (window.devicePixelRatio === 2) {
                let titleEl = canvasNode.querySelector('.template-title');
                titleEl.style.transform = 'scale(2)';
                titleEl.transformOrigin = 'top';
            }
            document.querySelector('.template-container').appendChild(canvasNode);
        } else {
            canvasNode = templateEl;
        }

        // 防止渲染引起的截屏
        await sleep(1500);

        const canvas = await html2canvas(canvasNode, {});

        if (activeModuleEl) {
            activeModuleEl.classList.add('tms-module-active');
            document.querySelector('.template-container').removeChild(canvasNode);
        }

        const dataURI = canvas.toDataURL('image/jpeg');
        const realData = dataURI.split(';')[1].split(",")[1];
        
        return base64toBlob(realData, 'image/jpeg');
    }
    
    uploadCoverImg(config) { 
        return Ajax.postForm(API.img.upload, { body: config });
    }
    
    saveTemplate(config) {
        return Ajax.postJSON(API.template.save, { body: config });   
    }
    
    publishTemplate(config) {
        return Ajax.post(API.template.publish, { body: config });   
    }

    get templateSaveConfig() {
        const { templateId, templateGlobleConfig, templateConfig } = this.store;
        const { name, startDate, endDate, ...globalConfig } = templateGlobleConfig;
        return {
            organizeId: ORGANIZE_ID,
            id: templateId,
            name: name,
            startDate: startDate,
            endDate: endDate,
            frontendAttrs: JSON.stringify({
                ...globalConfig,
                module: templateConfig
            })
        }
    }

	render() {
        const { 
            saveLoading,
            previewLoading,
            publishLoading,
            saveTemplateLoading,
            visible,
            url,
            qrcodeUrl,
            remark,
            remarkModalVisible
         } = this.state;
         const { title } = this.store.templateGlobleConfig.name;

		return (
			<div className="fixed-footer-bar">
                <div className="remark-box">
                    <Input 
                        value={remark}
                        placeholder="若有重要修改，请在这里备注哦～～"
                        onChange={this.handleRemarkChange}
                        style={{ 
                            height: '34px',
                            padding: '8px 12px',
                            borderRadius: '3px'
                        }}
                    />
                </div>
                <div className="op-btns">
                    <Button className="l-btn" loading={previewLoading} onClick={this.handlePreview}>预览</Button>
                    <Button className="l-btn" loading={saveLoading} onClick={this.handleSave}>保存</Button>
                    <Button className="l-btn" type="primary" loading={publishLoading} onClick={this.handlePublic}>发布</Button>
                    <Button className="r-btn" loading={saveTemplateLoading} onClick={this.handleSaveTemplate}>保存为模板</Button>
                </div>
                <PreviewPopup 
                    visible={visible} 
                    title={title} 
                    url={url} 
                    qrcodeUrl={qrcodeUrl}
                    onHidePreviewPopup={this.handleHidePreviewPopup} 
                />
            </div>
		)
	}
}

// Ajax.postJSON(API.module.save, { body: {
//     // id: 20,
//     code: 'MultiplePresellItem',
//     type: 'presale',
//     name: '预售活动',
//     coverImg: '//imgsize.52shangou.com/img/n/04/10/1523356087468_5413.png'
// } });

// Ajax.postJSON(API.module.save, { body: {
//     // id: 18,
//     code: 'PresellItem',
//     type: 'presale',
//     name: '多时间段预售活动',
//     coverImg: '//imgsize.52shangou.com/img/n/04/10/1523356087479_4140.png'
// } });