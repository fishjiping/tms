import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Icon } from 'antd';
import ImgUpload from '../../../../components/ImgUpload';


@inject('store')
@observer
export default class FixedBar extends React.Component {
	constructor(props) {
        super(props);
        this.store = props.store;
	}
	
    handleImgChange = (info) => {
		if (info.file.response) {
			const { uid, picList } = this.props;
			const pic = info.file.response.desc.replace(/^(http|https)*:/, '');
			this.store.updateModule(uid, { pic });
        }
	}

	handleImgDelete = () => {
		this.store.updateModule(uid, { pic: '' });
	}
	
	handleLinkChange = (e) => {
		const { uid, picList } = this.props;
		const link = e.target.value.trim();
		this.store.updateModule(uid, { link });
	}

	handleHeightChange = (e) => {
		let height = e.target.value.trim();
		height = parseInt(height);
		if (isNaN(height)) {
			height = '';
		}
		this.store.updateModule(this.props.uid, { height });
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
			pic,
			link,
			height,
			marginBottom
		 } = this.props;

		return (
			<div>
				<div className="form-item">
					<p className="form-item-title">悬浮框</p>
					<div className="form-item-content">
						<div className="item-block">
							<ImgUpload onChange={this.handleImgChange} text="上传图片" />
						</div>
						<div className="item-block">
							<Input value={link} placeholder="请输入跳转链接" onChange={this.handleLinkChange} style={{height: '30px'}} />
						</div>
						{
							pic && <div className="item-block img-block">
								<img className="thumbnail" src={pic} alt="" />
								<Icon type="close" onClick={this.handleImgDelete} />
							</div>
						}
					</div>
				</div>
				<div className="form-item">
                    <p className="form-item-title">图片高度</p>
                    <div className="form-item-content">
                        <Input value={height} placeholder="以750px宽度为准" onChange={this.handleHeightChange} />
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