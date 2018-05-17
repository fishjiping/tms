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
export default class MultiplePresellItem extends React.Component {
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

	handleCountDownTitleColorChange = (color) => {
		this.store.updateModule(this.props.uid, { countDownTitleColor: color });
	}

	handleCountDownTimeColorChange = (color) => {
		this.store.updateModule(this.props.uid, { countDownTimeColor: color });
	}

	handleCountDownTimeBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { countDownTimeBgColor: color });
	}

	handleNotStartBtnFontColorChange = (color) => {
		this.store.updateModule(this.props.uid, { notStartBtnFontColor: color });
	}

	handleNotStartBtnColorChange = (color) => {
		this.store.updateModule(this.props.uid, { notStartBtnColor: color });
	}

	handleProcessBtnFontColorChange = (color) => {
		this.store.updateModule(this.props.uid, { processBtnFontColor: color });
	}

	handleProcessBtnColorChange = (color) => {
		this.store.updateModule(this.props.uid, { processBtnColor: color });
	}

	handleFinishedBtnFontColorChange = (color) => {
		this.store.updateModule(this.props.uid, { finishedBtnFontColor: color });
	}

	handleFinishedBtnColorChange = (color) => {
		this.store.updateModule(this.props.uid, { finishedBtnColor: color });
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
			color,
            selectedColor,
			bgColor,
            selectedBgColor,
			countDownTitleColor,
			countDownTimeColor,
			countDownTimeBgColor,
            notStartBtnColor,
            processBtnColor,
            finishedBtnColor,
            notStartBtnFontColor,
            processBtnFontColor,
            finishedBtnFontColor,
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
                    <p className="form-item-title">倒计时颜色</p>
                    <div className="form-item-content">
						<div className="item-block">
                            <label className="clearfix">标题色<ColorPick color={countDownTitleColor} onChange={this.handleCountDownTitleColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">时间字体色<ColorPick color={countDownTimeColor} onChange={this.handleCountDownTimeColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">时间背景色<ColorPick color={countDownTimeBgColor} onChange={this.handleCountDownTimeBgColorChange} /></label>
                        </div>
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">加购按钮字体色</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">未开始<ColorPick color={notStartBtnFontColor} onChange={this.handleNotStartBtnFontColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">进行中<ColorPick color={processBtnFontColor} onChange={this.handleProcessBtnFontColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">已结束<ColorPick color={finishedBtnFontColor} onChange={this.handleFinishedBtnFontColorChange} /></label>
                        </div>
                    </div>
                </div>
				<div className="form-item">
                    <p className="form-item-title">加购按钮背景色</p>
                    <div className="form-item-content">
						<div className="item-block">
                            <label className="clearfix">未开始<ColorPick color={notStartBtnColor} onChange={this.handleNotStartBtnColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">进行中<ColorPick color={processBtnColor} onChange={this.handleProcessBtnColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">已结束<ColorPick color={finishedBtnColor} onChange={this.handleFinishedBtnColorChange} /></label>
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
							<ItemManageComponent activityId={activityId} itemType="presale" />
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