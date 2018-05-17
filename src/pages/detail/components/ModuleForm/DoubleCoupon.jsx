import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'antd';
import ColorPick from '../../../../components/ColorPick';
import CouponSelectComponent from '../CouponSelectComponent';
import CouponItem from './CouponItem';

@inject('store')
@observer
export default class DoubleCoupon extends React.Component {
	constructor(props) {
        super(props);
		this.store = props.store;
	}
	
    handleAddCoupon = (couponList) => {
		this.store.updateModule(this.props.uid, { couponList });
	}

	handleMoveToPrev = (index) => {
		const { uid, couponList } = this.props;

		if (index === 0) return;

		const temp = couponList[index];
		couponList[index] = couponList[index - 1];
		couponList[index - 1] = temp;
		this.store.updateModule(uid, { couponList });
	}

	handleMoveToNext = (index) => {
		const { uid, couponList } = this.props;

		if (index === couponList.length - 1) return;

		const temp = couponList[index];
		couponList[index] = couponList[index + 1];
		couponList[index + 1] = temp;
		this.store.updateModule(uid, { couponList });
	}

	handleDeleteCoupon = (index) => {
		const { uid, couponList } = this.props;
		couponList.splice(index, 1);
		this.store.updateModule(uid, { couponList });
	}

	handleNameColorChange = (color) => {
		this.store.updateModule(this.props.uid, { nameColor: color });
	}

	handleTitleColorChange = (color) => {
		this.store.updateModule(this.props.uid, { titleColor: color });
	}

	handleValidityColorChange = (color) => {
		this.store.updateModule(this.props.uid, { validityColor: color });
	}

	handleBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { bgColor: color });
	}

	handleBtnColorChange = (color) => {
		this.store.updateModule(this.props.uid, { btnColor: color });
	}

	handleBtnBgColorChange = (color) => {
		this.store.updateModule(this.props.uid, { btnBgColor: color });
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
			couponList, 
			nameColor, 
			titleColor, 
			validityColor, 
			bgColor, 
			btnColor, 
			btnBgColor,
			marginBottom 
		} = this.props;
		const len = couponList ? couponList.length : 0;

		return (
			<div>
				{
					couponList && couponList.map((item, i) => {
						return <CouponItem 
							key={item.id}
							index={i} 
							len={len}
							{...item} 
							onMoveToPrev={this.handleMoveToPrev}
							onMoveToNext={this.handleMoveToNext}
							onDeleteCoupon={this.handleDeleteCoupon} 
						/>
					})
				}
				<div className="form-item">
                    <div className="form-item-content">
						<CouponSelectComponent selectedCouponList={couponList} onAddCoupon={this.handleAddCoupon} />
                    </div>
					<div className="separator-line"></div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">内容色</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">名称颜色<ColorPick color={nameColor} onChange={this.handleNameColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">主标颜色<ColorPick color={titleColor} onChange={this.handleTitleColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">有效期颜色<ColorPick color={validityColor} onChange={this.handleValidityColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">背景色<ColorPick color={bgColor} onChange={this.handleBgColorChange} /></label>
                        </div>
                        <div className="separator-line"></div>
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">按钮色</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">字体颜色<ColorPick color={btnColor} onChange={this.handleBtnColorChange} /></label>
                        </div>
						<div className="item-block">
                            <label className="clearfix">背景颜色<ColorPick color={btnBgColor} onChange={this.handleBtnBgColorChange} /></label>
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