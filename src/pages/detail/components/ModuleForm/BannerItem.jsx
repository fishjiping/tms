import React from 'react';
import { Input, Icon } from 'antd';
import ImgUpload from '../../../../components/ImgUpload';

export default class BannerItem extends React.Component {
	handleImgChange = (info) => {
		if (info.file.response) {
			const { index, onImgChange } = this.props;
            const imageUrl = info.file.response.desc.replace(/^(http|https)*:/, '');
            onImgChange(index, imageUrl);
        }
	}

	handleImgDelete = () => {
		const { index, onImgChange } = this.props;
        onImgChange(index, '');
	}

	handleLinkChange = (e) => {
		const { index, onLinkChange } = this.props;
		let link = e.target.value.trim();
		onLinkChange(index, link);
	}

	handleMoveToPrev = () => {
		const { index, onMoveToPrev } = this.props;
		onMoveToPrev(index);
	}

	handleMoveToNext = () => {
		const { index, onMoveToNext } = this.props;
		onMoveToNext(index);
	}

	handleDeleteBanner = () => {
		const { index, onDelete } = this.props;
		onDelete(index);
	}

	render() {
		const { index, len, pic, link } = this.props;

		return (
			<div className="form-item">
				<p className="form-item-title">
					banner{index + 1}
					<span className="form-item-btns">
						{index !==0 && <Icon type="caret-up" onClick={this.handleMoveToPrev} />}
						{index !== len - 1 && <Icon type="caret-down" onClick={this.handleMoveToNext} />}
						<Icon type="delete" onClick={this.handleDeleteBanner} />
					</span>
                </p>
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
		);
	}
}