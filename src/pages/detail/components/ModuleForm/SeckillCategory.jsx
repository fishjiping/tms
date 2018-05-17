import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, Radio } from 'antd';
import API from '../../../../libs/api';
import { ORGANIZE_ID } from '../../../../libs/util';
import ColorPick from '../../../../components/ColorPick';
import ItemUpload from '../../../../components/ItemUpload';
import ItemManageComponent from '../ItemManageComponent';

const RadioGroup = Radio.Group;

@inject('store')
@observer
export default class SeckillCategory extends React.Component {
	constructor(props) {
        super(props);
		this.store = props.store;
	}

	handleColorChange = (color) => {
		this.store.updateModule(this.props.uid, { color });
	}

	handleSelectedColorChange = (color) => {
		this.store.updateModule(this.props.uid, { selectedColor: color });
	}

	handleBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { bgColor: color });
	}

	handleSelectedBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { selectedBgColor: color });
	}
	
	handleBtnColorChange = (color) => {
		this.store.updateModule(this.props.uid, { btnColor: color });
	}

	handleUpload = (data) => {
		this.store.updateModule(this.props.uid, { ...data });
	}

	handleArrangementModeChange = (e) => {
		this.store.updateModule(this.props.uid, { arrangementMode: e.target.value });
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
			color, 
			selectedColor,
			bgColor,
			selectedBgColor,
			btnColor,
			arrangementMode,
			marginBottom,
			activityId
		} = this.props;

		return (
			<div>
                <div className="form-item">
                    <p className="form-item-title">时间轴字体色</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">正常<ColorPick color={color} onChange={this.handleColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">已选中<ColorPick color={selectedColor} onChange={this.handleSelectedColorChange} /></label>
                        </div>
                    </div>
                </div>
				<div className="form-item">
                    <p className="form-item-title">时间轴背景色</p>
                    <div className="form-item-content">
						<div className="item-block">
                            <label className="clearfix">正常<ColorPick color={bgColor} onChange={this.handleBgColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">已选中<ColorPick color={selectedBgColor} onChange={this.handleSelectedBgColorChange} /></label>
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
							<ItemUpload {...this.uploadConfig} />
						</div>
						<div className="item-block text-link">
							<a href="/kaweb/page/organize/operation/operationManage#/list3" target="_blank">商品配置</a>
							<a className="download-template" href="/kaweb/download/example.xlsx">下载模板</a>
						</div>
						<div className="item-block">
							<ItemManageComponent activityId={activityId} itemType="secKill" />
						</div>
					</div>
				</div>
				<div className="form-item">
                    <p className="form-item-title">商品排列</p>
                    <div className="form-item-content">
						<RadioGroup onChange={this.handleArrangementModeChange} value={arrangementMode}>
							<Radio value={'lr'}>单列</Radio>
							<Radio value={'tb'}>双列</Radio>
							<Radio value={'tc'}>三列</Radio>
						</RadioGroup>
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