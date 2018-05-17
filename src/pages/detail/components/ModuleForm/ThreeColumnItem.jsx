import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'antd';
import API from '../../../../libs/api';
import { ORGANIZE_ID } from '../../../../libs/util';
import ColorPick from '../../../../components/ColorPick';
import ItemUpload from '../../../../components/ItemUpload';
import ItemManageComponent from '../ItemManageComponent';


@inject('store')
@observer
export default class ThreeColumnItem extends React.Component {
	constructor(props) {
        super(props);
		this.store = props.store;
	}
	
    handleTitleChange = (e) => {
        const title = e.target.value.trim();
        this.store.updateModule(this.props.uid, { title });
	}

	handleTitleColorChange = (color) => {
		this.store.updateModule(this.props.uid, { titleColor: color });
	}
	
	handleBtnColorChange = (color) => {
		this.store.updateModule(this.props.uid, { btnColor: color });
	}

	handleUpload = (data) => {
		this.store.updateModule(this.props.uid, { ...data });
	}

	handleMarginBottomChange = (e) => {
		let marginBottom = e.target.value.trim();
		marginBottom = parseInt(marginBottom);
		if (isNaN(marginBottom)) {
			marginBottom = '';
		}
		this.store.updateModule(this.props.uid, { marginBottom });
	}

	get uploadConfig() {
		const { startDate, endDate } = this.store.templateGlobleConfig;
		const { activityId } = this.props;
		const config = {
			name: 'mf',
			data: {
				organizeId: ORGANIZE_ID,
				startTime: startDate,
				endTime: endDate
			},
			showUploadList: false,
			action: API.item.upload,
			withCredentials: true,
			onChange: this.handleUpload
		};

		if (activityId) {
			config.data.activityId = activityId;
		}

		return config;
	}

	render() {
		const { 
			title,
			titleColor,
			btnColor,
			marginBottom,
			activityId
		} = this.props;

		return (
			<div>
                <div className="form-item">
                    <p className="form-item-title">版块名称</p>
                    <div className="form-item-content">
                        <Input value={title} placeholder="猜你喜欢" onChange={this.handleTitleChange} />
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">标题颜色</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">字体色<ColorPick color={titleColor} onChange={this.handleTitleColorChange} /></label>
                        </div>
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">按钮背景色</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">加购按钮<ColorPick color={btnColor} onChange={this.handleBtnColorChange} /></label>
                        </div>
                    </div>
                </div>
                <div className="form-item">
					<p className="form-item-title">商品选择</p>
					<div className="form-item-content">
						<div className="item-block">
							<ItemUpload {...this.uploadConfig}/>
						</div>
						<div className="item-block text-link">
							<a className="download-template" href="/kaweb/download/example.xlsx">下载模板</a>
						</div>
						<div className="item-block">
							<ItemManageComponent activityId={activityId} />
						</div>
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