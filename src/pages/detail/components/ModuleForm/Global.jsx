import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button, Checkbox, message, Icon } from 'antd';
import moment from 'moment';
import Ajax from '../../../../libs/ajax';
import API from '../../../../libs/api';
import { ORGANIZE_ID } from '../../../../libs/util';
import ColorPick from '../../../../components/ColorPick';
import ImgUpload from '../../../../components/ImgUpload';
import DateRangePick from '../DateRangePick';

@inject('store')
@observer
export default class Global extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
    }
    
    handleTitleChange = (e) => {
        const title = e.target.value.trim();
        this.store.updateModule(this.props.uid, { name: title });
    }

    handleBackgroundImageChange = (info) => {
        if (info.file.response) {
            const imageUrl = info.file.response.desc.replace(/^(http|https)*:/, '');
            this.store.updateModule(this.props.uid, { backgroundImage: imageUrl });
        }
    }

    handleDeleteBackgroundImage = () => {
        this.store.updateModule(this.props.uid, { backgroundImage: '' });
    }

    handleBgColorChange = (color) => {
        this.store.updateModule(this.props.uid, { backgroundColor: color });
    }

    handleDateChange = (data) => {
        const { templateGlobleConfig, templateConfig } = this.store
        const { startDate, endDate } = templateGlobleConfig;
        
        // 遍历所有模块，若存在活动id，更新此活动id的活动时间
        let activityIds = [];
        templateConfig.forEach((item, i) => {
            if (item.data && item.data.activityId) {
                activityIds.push(item.data.activityId);
            }
        });

        data.startDate = data.startDate || startDate;
        data.endDate = data.endDate || endDate;

        if (activityIds.length) {
            Ajax.post(API.activity.updateTime, {
                body: {
                    organizeId: ORGANIZE_ID,
                    activityIds: activityIds.join(),
                    startTime: data.startDate,
                    endTime: data.endDate
                }
            }).then(res => {
                if (res.status) {
                    this.store.updateModule(this.props.uid, data);
                } else {
                    message.error(res.message || '更新活动有效期失败！');
                }
            }).catch(error => {
                message.error(error,message || '更新活动有效期失败！');
            });
        } else {
            this.store.updateModule(this.props.uid, data);
        }
    }

    handleBackTopChange = (e) => {
        this.store.updateModule(this.props.uid, { hasBackTopBtn: e.target.checked });
    }

    handleCartChange = (e) => {
        this.store.updateModule(this.props.uid, { hasCartBtn: e.target.checked });
    }

	render() {
		const { 
            name,
            backgroundColor,
            backgroundImage,
            startDate,
            endDate,
            hasBackTopBtn,
            hasCartBtn
         } = this.props;

		return (
			<div>
                <div className="form-item">
                    <p className="form-item-title">页面标题名称</p>
                    <div className="form-item-content">
                        <Input value={name} placeholder="不超过6个字" onChange={this.handleTitleChange} />
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">页面背景</p>
                    <div className="form-item-content">
                        <div className="item-block">
                            <label className="clearfix">背景色<ColorPick color={backgroundColor} onChange={this.handleBgColorChange} /></label>
                        </div>
                        <div className="separator-line"></div>
                        <div className="item-block">
                            <ImgUpload onChange={this.handleBackgroundImageChange} text="上传背景图" />
                        </div>
                        {
                            backgroundImage && <div className="item-block img-block">
                                <img className="thumbnail" src={backgroundImage} alt="" />
                                <Icon type="close" onClick={this.handleDeleteBackgroundImage} />
                            </div>
                        }
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">页面有效期</p>
                    <div className="form-item-content">
                        <DateRangePick startDate={moment(startDate)} endDate={moment(endDate)} onChange={this.handleDateChange} />
                    </div>
                </div>
                <div className="form-item">
                    <p className="form-item-title">按钮设置</p>
                    <div className="form-item-content">
                        <Checkbox onChange={this.handleBackTopChange} checked={hasBackTopBtn}>返回顶部</Checkbox>
                        <Checkbox onChange={this.handleCartChange} checked={hasCartBtn}>购物车</Checkbox>
                    </div>
                </div>
			</div>
		);
	}
}