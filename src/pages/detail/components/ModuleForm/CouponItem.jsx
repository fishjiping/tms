import React from 'react';
import { Icon } from 'antd';

export default class CouponItem extends React.Component {

	handleMoveToPrev = () => {
		const { index, onMoveToPrev  } = this.props;
		onMoveToPrev(index);
	}

	handleMoveToNext = () => {
		const { index, onMoveToNext  } = this.props;
		onMoveToNext(index);
	}

	handleDeleteCoupon =  () => {
		const { index, onDeleteCoupon } = this.props;
		onDeleteCoupon(index);
	}

	render() {
		const { index, len, id, amount } = this.props;

		return (
			<div className="form-item">
				<p className="form-item-title">
					优惠券{index + 1}
					<span className="form-item-btns">
						{index !==0 && <Icon type="caret-up" onClick={this.handleMoveToPrev} />}
						{index !== len - 1 && <Icon type="caret-down" onClick={this.handleMoveToNext} />}
						<Icon type="delete" onClick={this.handleDeleteCoupon} />
					</span>
				</p>
				<div className="form-item-content">
					<div className="coupon">
						{
							amount === 0 ? 
							<div className="free-delivery">免邮券</div> :
							<div className="free-money">{amount / 100}</div>
						}
						<div className="coupon-id">券ID <span>{id}</span></div>
					</div>
				</div>
			</div>
		);
	}
}