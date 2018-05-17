import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'antd';
import BannerItem from './BannerItem';

@inject('store')
@observer
export default class Banner extends React.Component {
	constructor(props) {
        super(props);
        this.store = props.store;
	}
	
    handleImgChange = (index, imgUrl) => {
        const { uid, picList } = this.props;
		picList[index].pic = imgUrl;
		this.store.updateModule(uid, { picList });
	}
	
	handleLinkChange = (index, link) => {
		const { uid, picList } = this.props;
		picList[index].link = link;
		this.store.updateModule(uid, { picList });
	}

	handleAddBanner = () => {
		const { uid, picList } = this.props;
		picList.push({
			pic: '',
			link: ''
		});
		this.store.updateModule(uid, { picList });
	}

	handleMoveToPrev = (index) => {
		const { uid, picList } = this.props;

		if (index === 0) return;

		const temp = picList[index];
		picList[index] = picList[index - 1];
		picList[index - 1] = temp;
		this.store.updateModule(uid, { picList });
	}

	handleMoveToNext = (index) => {
		const { uid, picList } = this.props;

		if (index === picList.length - 1) return;

		const temp = picList[index];
		picList[index] = picList[index + 1];
		picList[index + 1] = temp;
		this.store.updateModule(uid, { picList });
	}

	handleDeleteBanner = (index) => {
		const { uid, picList } = this.props;
		picList.splice(index, 1);
		this.store.updateModule(uid, { picList });
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
			height,
			picList,
			marginBottom
		 } = this.props;
		 const len = picList ? picList.length : 0;

		return (
			<div>
				{
					len && picList.map((item, i) => {
						return (
							<BannerItem 
								key={i} 
								index={i} 
								len={len}
								{...item}
								onImgChange={this.handleImgChange}
								onLinkChange={this.handleLinkChange}
								onMoveToPrev={this.handleMoveToPrev}
								onMoveToNext={this.handleMoveToNext}
								onDelete={this.handleDeleteBanner} 
							/>
						);
					})
				}
				<div className="form-item">
                    <div className="form-item-content">
                        <Button onClick={this.handleAddBanner}>添加图片</Button>
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