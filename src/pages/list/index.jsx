import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, observer, inject } from 'mobx-react';
import { Button, Tabs } from 'antd';
import { ORGANIZE_ID } from '../../libs/util';
import API from '../../libs/api';
import Ajax from '../../libs/ajax';
import Stores from '../../stores/listStore';
import TagList from '../../components/TagList';
import TemplateList from './components/TemplateList';
import SearchForm from './components/SearchForm';
import './index.less';

const TabPane = Tabs.TabPane;

@inject('store')
@observer
class List extends React.Component {
	constructor(props) {
		super(props);
		this.store = props.store;
		this.parentTabActivityKey = '2';
		this.childTabActivityKey = '11';
		this.commonTemplateType = '';
		this.myTemplateType = '';
		this.myPageType = '';
	}

	handleChangeParentTab = (activityKey) => {
		this.parentTabActivityKey = activityKey;

		if (activityKey === '1') {// 模板库
			if (this.childTabActivityKey === '11') {// 官方模板
				this.store.getTemplateTypeList({ organizeId: -1 });
			} else {// 我的模板
				this.store.getTemplateTypeList({ organizeId: ORGANIZE_ID });
			}
		} else {// 我的页面
			this.store.getTemplateTypeList({ organizeId: ORGANIZE_ID });
		}

		this.store.getTemplateList(this.requestParams);
	}

	handleChangeChildTab = (activityKey) => {
		this.childTabActivityKey = activityKey;

		if (activityKey === '11') {// 官方模板
			this.store.getTemplateTypeList({ organizeId: -1 });
		} else {// 我的模板
			this.store.getTemplateTypeList({ organizeId: ORGANIZE_ID });
		}

		this.store.getTemplateList(this.requestParams);
	}

	handleChangeTag = (type) => {
		if (this.parentTabActivityKey === '1') {// 模板库
			if (this.childTabActivityKey === '11') {// 官方模板
				this.commonTemplateType = type;
			} else {//我的模板
				this.myTemplateType = type;
			}
		} else {// 我的页面
			this.myPageType = type;
		}

		this.store.getTemplateList(this.requestParams);
	}

	handleChangePage = (page) => {
		const params = Object.assign(this.requestParams, {
			currentPage: page
		});
		this.store.getTemplateList(params);
	}

	handleChangeSize = (page, pageSize) => {
		const params = Object.assign(this.requestParams, {
			currentPage: page,
			size: pageSize
		});
		this.store.getTemplateList(params);
	}

	handleChangeFormData = (type, changeFields) => {
		this.store.seFormData(type, changeFields);
	}

	handleForm = () => {
		this.store.getTemplateList(this.requestParams);
	}

	showTotal (total) {
		return `共 ${total} 条`;
	}

	componentDidMount() {
		this.store.getTemplateTypeList({ organizeId: ORGANIZE_ID });
		this.store.getTemplateList(this.requestParams);
	}

	get requestParams() {
		const {
			commonTemplateFormData,
			myTemplateFormData,
			myPageFormData,
			commonTemplateCfg,
			myTemplateCfg,
			myPageCfg
		} = this.store;

		if (this.parentTabActivityKey === '1') {// 模板库
			if (this.childTabActivityKey === '11') {// 官方模板
				return {
					organizeId: -1,
					type: this.commonTemplateType,
					orderByField: commonTemplateFormData.orderByField.value,
					nameLike: commonTemplateFormData.nameLike.value,
					startDate: commonTemplateFormData.dateRange.value.startValue ? commonTemplateFormData.dateRange.value.startValue.format("YYYY-MM-DD") : '',
					endDate: commonTemplateFormData.dateRange.value.endValue && commonTemplateFormData.dateRange.value.endValue.format("YYYY-MM-DD") || '', 
					orderByDirection: commonTemplateFormData.orderByDirection.value,
					currentPage: 1,
					size: commonTemplateCfg.pageSize,
				};
			} else {//我的模板
				return {
					organizeId: ORGANIZE_ID,
					kaCommon: 1,
					type: this.myTemplateType,
					orderByField: myTemplateFormData.orderByField.value,
                    nameLike: myTemplateFormData.nameLike.value,
                    startDate: myTemplateFormData.dateRange.value.startValue ? myTemplateFormData.dateRange.value.startValue.format("YYYY-MM-DD") : '',
                    endDate: myTemplateFormData.dateRange.value.endValue ? myTemplateFormData.dateRange.value.endValue.format("YYYY-MM-DD") : '', 
                    orderByDirection: myTemplateFormData.orderByDirection.value,
					currentPage: 1,
					size: myTemplateCfg.pageSize
				};
			}
		} else {// 我的页面
			return {
				organizeId: ORGANIZE_ID,
				kaCommon: 0,
				type: this.myPageType,
				orderByField: myPageFormData.orderByField.value,
				nameLike: myPageFormData.nameLike.value,
				startDate: myPageFormData.dateRange.value.startValue ? myPageFormData.dateRange.value.startValue.format("YYYY-MM-DD") : '',
				endDate: myPageFormData.dateRange.value.endValue ? myPageFormData.dateRange.value.endValue.format("YYYY-MM-DD") : '', 
				orderByDirection: myPageFormData.orderByDirection.value,
				currentPage: 1,
				size: myPageCfg.pageSize
			}
		}
	}

	get commonTemplateCfg() {
		const { total, pageNo, pageSize } = this.store.commonTemplateCfg;
		return {
			total           : total,
            current         : pageNo,
			pageSize        : pageSize || 20,
			showTotal       : this.showTotal,
			showSizeChanger : true,
			pageSizeOptions : ['10', '20', '30', '40', '50'],
			showQuickJumper : true,
			onChange        : this.handleChangePage,
			onShowSizeChange: this.handleChangeSize
		};
	}

	get myTemplateCfg() {
		const { total, pageNo, pageSize } = this.store.myTemplateCfg;
		return {
			total           : total,
            current         : pageNo,
			pageSize        : pageSize || 20,
			showTotal       : this.showTotal,
			showSizeChanger : true,
			pageSizeOptions : ['10', '20', '30', '40', '50'],
			showQuickJumper : true,
			onChange        : this.handleChangePage,
			onShowSizeChange: this.handleChangeSize
		};
	}

	get myPageCfg() {
		const { total, pageNo, pageSize } = this.store.myPageCfg;
		return {
			total           : total,
            current         : pageNo,
			pageSize        : pageSize || 20,
			showTotal       : this.showTotal,
			showSizeChanger : true,
			pageSizeOptions : ['10', '20', '30', '40', '50'],
			showQuickJumper : true,
			onChange        : this.handleChangePage,
			onShowSizeChange: this.handleChangeSize
		};
	}

	render() {
		const { 
			templateTypeList,
			commonTemplateFormData,
			myTemplateFormData,
			myPageFormData,
			commonTemplateList,
			myTemplateList,
			myPageList,
			templateLoading
		} = this.store;

		return (
			<div>
				<Button className="create-btn"><a href="./detail.html" target="_blank">创建页面</a></Button>
				<Tabs 
					className="content-tabs" 
					defaultActiveKey="2"
					onChange={this.handleChangeParentTab}
				>
					<TabPane tab="模板库" key="1">
						<Tabs
							className="tabs-container"
							defaultActiveKey="11"
							animated={false}
							onChange={this.handleChangeChildTab}
						>
							<TabPane tab="官方模板" key="11">
								<TagList 
									list={templateTypeList} 
									handleChangeTag={this.handleChangeTag} 
								/>
								<SearchForm 
									type={1} 
									{...commonTemplateFormData} 
									onSubmit={this.handleForm} 
									onChange={this.handleChangeFormData} 
								/>
								<TemplateList 
									type={1} 
									list={commonTemplateList} 
									pagination={this.commonTemplateCfg} 
									loading={templateLoading} 
								/>
							</TabPane>
							<TabPane tab="我的模板" key="22">
								<TagList 
									list={templateTypeList} 
									handleChangeTag={this.handleChangeTag} 
								/>
								<SearchForm 
									type={2} 
									{...myTemplateFormData} 
									onSubmit={this.handleForm} 
									onChange={this.handleChangeFormData}
								/>
								<TemplateList 
									type={2} 
									list={myTemplateList} 
									pagination={this.myTemplateCfg} 
									loading={templateLoading}
								/>
							</TabPane>
						</Tabs>
					</TabPane>
					<TabPane tab="我的页面" key="2">
						<TagList 
							list={templateTypeList} 
							handleChangeTag={this.handleChangeTag} 
						/>
						<SearchForm 
							type={3} 
							{...myPageFormData}
							onSubmit={this.handleForm} 
							onChange={this.handleChangeFormData}
						/>
						<TemplateList 
							type={3} 
							list={myPageList} 
							pagination={this.myPageCfg} 
							loading={templateLoading} 
						/>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}

const store = new Stores();

ReactDOM.render(<Provider store={store}><List/></Provider>, document.getElementById('root'));