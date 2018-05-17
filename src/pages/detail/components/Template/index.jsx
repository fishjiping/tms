import React from 'react';
import { observer, inject } from 'mobx-react';
import { Spin } from 'antd';
import DropBox from './DropBox';
import { urlParams, ORGANIZE_ID } from '../../../../libs/util';
import GlobalModule from './GlobalModule';
import CustomModule from './CustomModule';
import './index.less';

@inject('store')
@observer
export default class Template extends React.Component {
	constructor(props) {
		super(props);
		this.store = props.store;
		this.state = { checkedId: -1 };
	}

	/**
	 * 选择模块
	 * @param uid 模块唯一id，在模块加入模板时生成
	 * @memberof Template
	 */
	handleCheckedModule = (uid) => {
		this.setState({ checkedId: uid });
	}

	/**
	 * 新增模块
	 * @param data 模块信息,包括基础信息和数据
	 * @memberof Template
	 */
	handleAddModule = (data) => {
		this.store.addModule(data);
		this.setState({ checkedId: data.baseInfo.uid });
	}

	/**
	 * 删除模块
	 * @param uid 模块唯一id，在模块加入模板时生成
	 * @memberof Template
	 */
	handleDeleteModule = (uid) => {
		this.store.deleteModule(uid);
	}

	/**
	 * 移动模块
	 * @param dragIndex 开始位置
	 * @param hoverIndex 结束位置
	 * @memberof Template
	 */
	handleMoveModule = (dragIndex, hoverIndex) => {
		this.store.moveModule(dragIndex, hoverIndex);
	}

	componentDidMount() {
		const templateId = urlParams.id;
		const operRecordId = urlParams.operRecordId;
		if (templateId) {
			let params = {
				id: templateId,
				organizeId: ORGANIZE_ID
			};

			// 查看页面操作记录，请求增加操作记录id
			if (operRecordId) {
				Object.assign(params, { operRecordId });
			}

			this.store.getTemplateDetail(params);
			this.store.setTemplateId(templateId);
		} else {
			this.store.setTemplateLoading(false);
		}
	}

	get renderTemplateContent() {
		const { templateConfig } = this.store;
		const { checkedId } = this.state;

		if (templateConfig && templateConfig.length > 0) {
			return (
				<div className="template-content">
					{
						templateConfig.map((item, i) => {
							return (
								<CustomModule 
									key={item.baseInfo.uid}
									{...item} 
									index={i} 
									checked={checkedId === item.baseInfo.uid} 
									handleCheckedModule={this.handleCheckedModule} 
									handleDeleteModule={this.handleDeleteModule}
									handleMoveModule={this.handleMoveModule}
								/>
							)
						})
					}			
				</div>
			);
		} else {
			return null;
		}
	}

	render() {
		const { templateGlobleConfig, templateConfig, templateLoading } = this.store;
		const { checkedId } = this.state;

		return (
			<div className="template-container">
				<DropBox handleAddModule={this.handleAddModule}>
					<div className="template">
						{
							templateLoading ?
							<Spin spinning={templateLoading}></Spin> :
							<div>
								<GlobalModule
									data={templateGlobleConfig} 
									checked={checkedId === -1} 
									handleCheckedModule={this.handleCheckedModule} 
								/>
								{this.renderTemplateContent}
								{
									!templateConfig || templateConfig.length === 0 ?
									<div className="tms-module-area">模块拖至此处</div> :
									null
								}
							</div>
						}
					</div>
				</DropBox>
			</div>
		);
	}
}