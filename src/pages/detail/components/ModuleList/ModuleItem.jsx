import React from 'react';
import { message } from 'antd';
import DragBox from './DragBox';

export default class ModuleItem extends React.PureComponent {  
    render() {
        const { name, coverImg } = this.props;

        return (
            <div className="module-item">
                <span className="module-name">{name}</span>
                <DragBox {...this.props}><img className="cover" src={coverImg} alt="" /></DragBox>
            </div>
        );
    }
}