import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input } from 'antd';
import ColorPick from '../../../../components/ColorPick';

const TextArea = Input.TextArea;

@inject('store')
@observer
export default class DoubleBanner extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
    }

    handleSmallFontSizeClick = () => {
        if (this.props.fontSize !== 24) {
            this.store.updateModule(this.props.uid, { fontSize: 24 });
        }
    }

    handleMiddleFontSizeClick = () => {
        if (this.props.fontSize !== 28) {
            this.store.updateModule(this.props.uid, { fontSize: 28 });
        }
    }

    handleBigFontSizeClick = () => {
        if (this.props.fontSize !== 38) {
            this.store.updateModule(this.props.uid, { fontSize: 38 });
        }
    }

    handleLeftTextAlignClick = () => {
        if (this.props.textAlign !== 'left') {
            this.store.updateModule(this.props.uid, { textAlign: 'left' });
        }
    }

    handleCenterTextAlignClick = () => {
        if (this.props.textAlign !== 'center') {}
            this.store.updateModule(this.props.uid, { textAlign: 'center' });
    }

    handleRightTextAlignClick = () => {
        if (this.props.textAlign !== 'right') {
            this.store.updateModule(this.props.uid, { textAlign: 'right' });
        }
    }

    handleColorChange = (color) => {
        this.store.updateModule(this.props.uid, { color: color });
    }

    handleContentChange = (e) => {
        this.store.updateModule(this.props.uid, { content: e.target.value });
    }

    handleMarginBottomChange = (e) => {
		let marginBottom = e.target.value.trim();
		marginBottom = parseInt(marginBottom);
		if (isNaN(marginBottom)) {
			marginBottom = '';
		}
		this.store.updateModule(this.props.uid, { marginBottom });
	}

	render() {
		const { 
			fontSize,
            color,
            textAlign,
            content,
			marginBottom
         } = this.props;

		return (
			<div>
				<div className="form-item">
                    <p className="form-item-title">字号</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <ul className="text-check-list">
                                <li className={fontSize === 38 ? 'checked' : ''} onClick={this.handleBigFontSizeClick}>大</li>
                                <li className={fontSize === 28 ? 'checked' : ''} onClick={this.handleMiddleFontSizeClick} >中</li>
                                <li className={fontSize === 24 ? 'checked' : ''} onClick={this.handleSmallFontSizeClick} >小</li>
                            </ul>
                        </div>
                        <div className="separator-line"></div>
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">字体号</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">字体色<ColorPick color={color} onChange={this.handleColorChange} /></label>
                        </div>
                        <div className="separator-line"></div>
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">文本对齐</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <ul className="text-check-list">
                                <li className={textAlign === 'left' ? 'checked' : ''} onClick={this.handleLeftTextAlignClick}>左</li>
                                <li className={textAlign === 'center' ? 'checked' : ''} onClick={this.handleCenterTextAlignClick}>中</li>
                                <li className={textAlign === 'right' ? 'checked' : ''} onClick={this.handleRightTextAlignClick}>右</li>
                            </ul>
                        </div>
                        <div className="separator-line"></div>
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">文本</p>
                    <div className="form-item-content">
                        <TextArea value={content} onChange={this.handleContentChange} style={{height: '58px'}} />
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">组件下方留白</p>
                    <div className="form-item-content">
                        <Input value={marginBottom} placeholder="以750px宽度为准" onChange={this.handleMarginBottomChange} />
                    </div>
                </div>
			</div>
		);
	}
}