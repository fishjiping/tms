import React from 'react';
import { Icon, Popconfirm } from 'antd';
import { HOST } from '../../../../libs/util';
import ModuleForm from '../ModuleForm';

export default class TemplateItem extends React.Component {
    handleCheckedModule = () => {
        const { checked, handleCheckedModule } = this.props;

        if (!checked) {
            // 设置选中模块序号为-1,表示全局模块被选中
            handleCheckedModule(-1);
        }
    }

    handleHideCheckedModuleState = () => {
        // 设置选中模块序号为空表示未有模块被选中
        this.props.handleCheckedModule('');
    }

    get baseInfo() {
        return {
			id: -1,
			code: 'Global',
			uid: -1
		};
    }
  
    render() {
        const {
            data, 
            checked
         } = this.props;

         return (
            <div className={checked ? 'tms-module tms-module-active' : 'tms-module'}>
                <img 
                    className="tms-module-img"
                    src={`${HOST}/baohe/urlProxy?_path=/img/n/01/23/1516706345854_9941.png`}
                    alt=""
                />
                <div 
                    className="template-title"
                    onClick={this.handleCheckedModule}
                >{data.name}</div>
                <ModuleForm baseInfo={this.baseInfo} data={data} checked={checked} handleHideCheckedModuleState={this.handleHideCheckedModuleState} />
            </div>
        );
    }
}