import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, Select } from 'antd';
import API from '../../../../libs/api';
import { ORGANIZE_ID } from '../../../../libs/util';
import ColorPick from '../../../../components/ColorPick';
import ItemUpload from '../../../../components/ItemUpload';
import ItemManageComponent from '../ItemManageComponent';
import { defaultData } from './default';

const Option = Select.Option;

@inject('store')
@observer
export default class HotItem extends React.Component {
	constructor(props) {
        super(props);
		this.store = props.store;
	}
	
    handleStyleTypeChange = (type) => {
		const data = defaultData.HotItem.styleMap[type];
		if (data) {
			this.store.updateModule(this.props.uid, data);
		}
	}

	handleNameColorChange = (color) => {
		this.store.updateModule(this.props.uid, { nameColor: color });
	}
	
	handleDescColorChange = (color) => {
		this.store.updateModule(this.props.uid, { descColor: color });
	}

	handleBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { bgColor: color });
	}

	handleAddBtnColorChange = (color) => {
		this.store.updateModule(this.props.uid, { addBtnColor: color });
	}

	handleAddBtnBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { addBtnBgColor: color });
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
			styleType, 
			nameColor,
			descColor,
			bgColor,
			addBtnColor,
			addBtnBgColor,
			marginBottom,
			activityId
		} = this.props;

		return (
			<div>
                <div className="form-item">
                    <p className="form-item-title">推荐样式</p>
                    <div className="form-item-content">
                        <div className="item-block">
							<Select 
								defaultValue={styleType} 
								dropdownStyle={{ textAlign: 'center' }}
								style={{ width: '100%', height: '24px' }}
								onChange={this.handleStyleTypeChange}
							>
								<Option value="yellow">淡黄色</Option>
								<Option value="red">热烈红</Option>
								<Option value="green">苹果绿</Option>
							</Select>
                        </div>
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">商品名称</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">字体色<ColorPick color={nameColor} onChange={this.handleNameColorChange} /></label>
                        </div>
                    </div>
                </div>
				<div className="form-item">
                    <p className="form-item-title">副标题</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">字体色<ColorPick color={descColor} onChange={this.handleDescColorChange} /></label>
                        </div>
                    </div>
                </div>
				<div className="form-item">
                    <p className="form-item-title">组件背景</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">字体色<ColorPick color={bgColor} onChange={this.handleBgColorChange} /></label>
                        </div>
                    </div>
                </div>
				<div className="form-item">
                    <p className="form-item-title">加购按钮</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">字体色<ColorPick color={addBtnColor} onChange={this.handleAddBtnColorChange} /></label>
                        </div>
						<div className="item-block">
							<label className="clearfix">背景色<ColorPick color={addBtnBgColor} onChange={this.handleAddBtnBgColorChange} /></label>
                        </div>
                    </div>
                </div>
                <div className="form-item">
					<p className="form-item-title">商品选择</p>
					<div className="form-item-content">
						<div className="item-block">
							<ItemUpload {...this.uploadConfig} />
						</div>
						<div className="item-block text-link">
							<a className="download-template" href="/kaweb/download/commonset_define_name.xlsx">下载模板</a>
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