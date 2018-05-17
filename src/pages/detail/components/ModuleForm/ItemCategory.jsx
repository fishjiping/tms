import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, Upload, Radio, message } from 'antd';
import { ORGANIZE_ID } from '../../../../libs/util';
import API from '../../../../libs/api';
import ColorPick from '../../../../components/ColorPick';
import ItemUpload from '../../../../components/ItemUpload';
import ItemManageComponent from '../ItemManageComponent';

const RadioGroup = Radio.Group;

@inject('store')
@observer
export default class ItemCategory extends React.Component {
	constructor(props) {
        super(props);
		this.store = props.store;
	}

	handleBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { bgColor: color });
	}

	handleFontColorChange = (color) => {
		this.store.updateModule(this.props.uid, { fontColor: color });
	}

	handleSelectedFontColorChange = (color) => {
		this.store.updateModule(this.props.uid, { selectedFontColor: color });
	}

	handleSelectedUnderlineColorChange = (color) => {
		this.store.updateModule(this.props.uid, { selectedUnderlineColor: color });
	}

	handleArrowColorChange = (color) => {
		this.store.updateModule(this.props.uid, { arrowColor: color });
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
			bgColor,
			fontColor,
			selectedFontColor,
			selectedUnderlineColor,
			arrowColor,
			btnColor,
			arrangementMode,
			marginBottom,
			activityId
		} = this.props;

		return (
			<div>
				<div className="form-item">
                    <p className="form-item-title">类目颜色</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">背景色<ColorPick color={bgColor} onChange={this.handleBgColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">正常字体颜色<ColorPick color={fontColor} onChange={this.handleFontColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">选中字体颜色<ColorPick color={selectedFontColor} onChange={this.handleSelectedFontColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">选中下划线颜色<ColorPick color={selectedUnderlineColor} onChange={this.handleSelectedUnderlineColorChange} /></label>
                        </div>
						{/* <div className="item-block">
                            <label className="clearfix">下拉箭头<ColorPick color={arrowColor} onChange={this.handleArrowColorChange} /></label>
                        </div> */}
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
							<a className="download-template" href="/kaweb/download/common_set_tag.xlsx">下载模板</a>
						</div>
						<div className="item-block">
							<ItemManageComponent activityId={activityId} />
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