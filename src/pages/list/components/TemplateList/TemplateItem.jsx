import React from 'react';
import { Icon, Popover, message } from 'antd';
import QRCode from 'qrcode.react';
import moment from 'moment';
import Clipboard from 'clipboard';
import Ajax from '../../../../libs/ajax';
import API from '../../../../libs/api';
import { ORGANIZE_ID } from '../../../../libs/util';
import PreviewPopup from '../../../../components/PreviewPopup';
import HistoryRecordComponent from '../HistoryRecordComponent';

export default class TemplateItem extends React.PureComponent {
    constructor(props) {
		super(props);
        this.state = {
            timestamp: Date.now(),
            visible: false
        };
    }

    handleCopyTemplate = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 请求前先打开一个假页面，请求成功后再重定向到新的页面，防止被打开页面被拦截
        const newWindow = window.open('./detail.html', '_blank');
        Ajax.get(API.template.copy, {
            params: {
                organizeId: ORGANIZE_ID,
                oriId: this.props.id
            }
        }).then(res => {
            if (res.status) {
                newWindow.location.href = `./detail.html?id=${res.entry}`;
            } else {
                newWindow.close();
                message.error(res.message || '复制模板失败！');
            }
        }).catch(error => {
            newWindow.close();
            message.error(error.message || '复制模板失败！');
        });
    }

    handleCopyUrl = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    handleShowPreviewPopup = (e) => {
        this.setState({ visible : true });
    }

    handleHidePreviewPopup = () => {
        this.setState({ visible : false });
    }

    handleQRCodeVisibleChange = (visible) => {
        if (visible) {
            // 防止页面被缓存
            this.setState({ timestamp: Date.now() });
        }
    }

    getPopupContainer = () => {
        return this.popupContainer
    }
    
    componentDidMount() {
        const { type, id } = this.props;
        if (type != 1) {
            const clipboard = new Clipboard(`#copy-btn-${id}`);
            clipboard.on('success', function(e) {
                message.success('复制成功');
            });
            clipboard.on('error', function(e) {
                message.error('复制失败');
            });
        }
    }
  
    render() {
        const { 
            type, 
            id, 
            name, 
            coverImg, 
            url, 
            qrcodeUrl, 
            publish, 
            gmtModify 
        } = this.props;
        const { 
            visible, 
            timestamp 
        } = this.state;

        if (type === 3) {
            return (
                <a 
                    className="template-item" 
                    href={`./detail.html?id=${id}`} 
                    target="_blank"
                >
                    <div className="template-cover">
                        <img src={coverImg} alt="" />
                    </div>
                    <div className="template-info">
                        <div className="text-box">
                            <p className="title">{name || '暂未设置标题~'}</p>
                            <p className="date">修改日期：{moment(gmtModify).format('YYYY.MM.DD HH:mm')}</p>
                        </div>
                        <div className="op-box">
                            <span id={`copy-btn-${id}`} className="copy-btn" data-clipboard-text={qrcodeUrl} onClick={this.handleCopyUrl}><Icon type="link" /><span>复制页面链接</span></span>
                            <HistoryRecordComponent id={id} />
                            {
                                publish === 0
                                ? <Popover 
                                    overlayClassName="text-popover"
                                    placement="topRight"
                                    content={<p className="unpublished-text">页面未发布~</p>}
                                    getPopupContainer={this.getPopupContainer} 
                                >
                                    <div className="qrcode-btn" ref={(el) => {this.popupContainer = el;}}></div>
                                </Popover>
                                : <Popover 
                                    overlayClassName="qrcode-popover"
                                    placement="topRight"
                                    content={
                                        <div className="qrcode-container">
                                            <span className="qrcode-text">扫码查看</span>
                                            <div className="qrcode"><QRCode value={`${qrcodeUrl}?t=${timestamp}`} size={60} /></div>
                                        </div>
                                    }
                                    getPopupContainer={this.getPopupContainer} 
                                    onVisibleChange={this.handleQRCodeVisibleChange}
                                >
                                    <div className="qrcode-btn" ref={(el) => {this.popupContainer = el;}}></div>
                                </Popover>
                            }
                        </div>
                    </div>
                </a>
            );
        } else {
            return (
                <a 
                    className="template-item" 
                    onClick={this.handleShowPreviewPopup}
                >
                    <div className="template-cover">
                        <img src={coverImg} alt="" />
                    </div>
                    <div className="template-info">
                        <div className="text-box">
                            <p className="title">{name || '暂未设置标题~'}</p>
                            <p className="date">修改日期：{moment(gmtModify).format('YYYY.MM.DD HH:mm')}</p>
                        </div>
                        <div className="op-box">
                            <span className="copy-btn use-template" onClick={this.handleCopyTemplate}><Icon type="copy" /><span>使用模板</span></span>
                            <HistoryRecordComponent id={id} />
                            <Popover 
                                overlayClassName="qrcode-popover"
                                placement="topRight"
                                content={
                                    <div className="qrcode-container">
                                        <span className="qrcode-text">扫码查看</span>
                                        <div className="qrcode"><QRCode value={`${qrcodeUrl}?t=${timestamp}`} size={60} /></div>
                                    </div>
                                }
                                getPopupContainer={this.getPopupContainer} 
                                onVisibleChange={this.handleQRCodeVisibleChange}
                            >
                                <div className="qrcode-btn" ref={(el) => {this.popupContainer = el;}}></div>
                            </Popover>
                        </div>
                    </div>
                    <PreviewPopup 
                        visible={visible} 
                        title={name} 
                        url={url} 
                        qrcodeUrl={qrcodeUrl}
                        isTemplate
                        onHidePreviewPopup={this.handleHidePreviewPopup} 
                        onCopyTemplate={this.handleCopyTemplate} 
                    />
                </a>
            );
        }
    }
}