import React from 'react';
import { DropTarget } from 'react-dnd';
import { getUid } from '../../../../libs/util';
import { defaultData } from '../ModuleForm/default';

const boxTarget = {
	drop(props, monitor, component) {
		const baseInfo = monitor.getItem();
		baseInfo.uid = getUid();
		props.handleAddModule({
			baseInfo,
			data: defaultData[baseInfo.code]
		})
	}
}

@DropTarget('module', boxTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))
export default class DropBox extends React.Component {
	render() {
        const { children, isOver, canDrop, connectDropTarget } = this.props;
        
		return connectDropTarget(<div className={isOver && canDrop ? 'can-drop' : ''}>{children}</div>);
	}
}