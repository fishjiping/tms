import React from 'react';
import { observer, inject } from 'mobx-react';
import { Spin } from 'antd';
import { ORGANIZE_ID } from '../../../../libs/util';
import TagList from '../../../../components/TagList';
import ModuleItem from './ModuleItem';
import './index.less';

@inject('store')
@observer
export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
        this.state = { filterType: '' };
    }

    handleChangeTag = (type) => {
        this.setState({ filterType: type });
	}

    componentDidMount() {
        // 组件列表是分页接口，默认取100个，一次性取完
		this.store.getModuleList({
			type: '',
			currentPage: 1,
			size: 100,
			organizeId: ORGANIZE_ID
        });
        
        this.store.getModuleTagList({});
    }

    get moduleList() {
        const { moduleList } = this.store;
        const { filterType } = this.state;
        let newModuleList = [];

        moduleList.forEach((item, i) => {
            if (filterType === '' || filterType === item.type) {
                const attrs = JSON.parse(item.attrs);
                item.coverImg = attrs.coverImg;
                newModuleList.push(item);
            }
        });

        return newModuleList;
    }

    get renderModuleList() {
        const moduleList = this.moduleList;

        if (moduleList && moduleList.length > 0) {
            return (
                <div className="module-list-wrap">
                    <div className="module-list">
                        {
                            moduleList.map((item, i) => {
                                return <ModuleItem key={item.id} {...item} />;
                            })
                        }
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }

	render() {
        const { moduleList, moduleTagList, moduleLoading } = this.store;
        
		return (
            <div className="module-container">
                <Spin spinning={moduleLoading}></Spin> 
                <TagList 
                    list={moduleTagList} 
                    handleChangeTag={this.handleChangeTag}
                />
                {this.renderModuleList}
            </div>
		)
	}
}
