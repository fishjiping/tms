import React from 'react';
import { Button, Modal } from 'antd';
import QRCode from 'qrcode.react';
import './index.less';

export default class PreviewPopup extends React.Component {
    handleSelectUrl = (e) => {
        e.target.select();
    }

    hideModal = () => {
        this.props.onHidePreviewPopup();
    }
    
    get modalConfig() {
        return {
            className: "preview-popup",
            visible: this.props.visible,
            footer: null,
            closable: false,
            maskClosable: true,
            width: 340,
            style: {
                left: 450,
                top: 140,
                bottom:140,
                margin: 0
            },
            onCancel: this.hideModal,
        }
    }

	render() {
         const { 
            title, 
            url, 
            qrcodeUrl,
            isTemplate, 
            onCopyTemplate
        } = this.props;

        if (isTemplate) {
            return (
                <Modal {...this.modalConfig}>
                    <div className="page-container">
                        <div className="page-title">{title}</div>
                        <div className="img-content"><img src={url} /></div>
                    </div>
                    <div className="qrcode-container">
                        <QRCode value={qrcodeUrl} size={165} />
                        <p className="qrcode-text">扫一扫手机在线预览</p>
                    </div>
                    <div className="copy-template-btn">
                        <Button type="primary" size="default" style={{ width: 203 }} onClick={onCopyTemplate}>一键使用</Button>
                    </div>
                </Modal>
            );
        } else {
            return (
                <Modal {...this.modalConfig}>
                    <div className="page-container">
                        <div className="page-title">{title}</div>
                        <iframe className="page-content" src={url}></iframe>
                    </div>
                    <div className="qrcode-container">
                        <QRCode value={qrcodeUrl} size={165} />
                        <p className="qrcode-text">扫一扫手机在线预览</p>
                        <div className="link-text">
                            <p>页面链接如下，请完整复制用于投放</p>
                            <textarea value={qrcodeUrl} onFocus={this.handleSelectUrl}></textarea>
                        </div>
                    </div>
                </Modal>
            );
        }
	}
}
