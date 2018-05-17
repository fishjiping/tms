import React from 'react';
import { findDOMNode } from 'react-dom';
import { Icon, Popconfirm } from 'antd';
import { DragSource, DropTarget } from 'react-dnd'
import { HOST } from '../../../../libs/util';
import ModuleForm from '../ModuleForm';

const cardSource = {
	beginDrag(props) {
		return {
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.handleMoveModule(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}

@DropTarget('sortmodule', cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource('sortmodule', cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
}))
export default class CustomModule extends React.Component {
    handleCheckedModule = () => {
        const { baseInfo, checked, handleCheckedModule } = this.props;

        if (!checked) {
            handleCheckedModule(baseInfo.uid);
        }
    }

    handleHideCheckedModuleState = () => {
        // 设置选中模块序号为-1表示未有模块被选中
        this.props.handleCheckedModule('');
    }

    handleDeleteModule = () => {
        const { baseInfo } = this.props;
        this.props.handleDeleteModule(baseInfo.uid);
    }

    componentDidMount() {
        const { baseInfo, connectDragPreview } = this.props;
        const img = new Image();
        img.onload = () => connectDragPreview(img);
        img.src = `${baseInfo.coverImg}@340w.png`;
	}
  
    render() {
        const { 
            baseInfo, 
            data, 
            checked,
            isDragging,
			connectDragSource,
			connectDropTarget
        } = this.props;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(
            connectDropTarget(<div className={`tms-module ${checked ? 'tms-module-active' : ''}`} style={{ opacity }} >
                <img 
                    className="tms-module-img"
                    src={`${HOST}/baohe/urlProxy?_path=/${baseInfo.coverImg.split('?')[0].split('/').slice(3).join('/')}`} 
                    alt={baseInfo.name} 
                    onClick={this.handleCheckedModule}
                />
                <ModuleForm 
                    baseInfo={baseInfo} 
                    data={data} 
                    handleHideCheckedModuleState={this.handleHideCheckedModuleState} 
                />
                <Popconfirm title={`确认删除${baseInfo.name}模块吗？`} onConfirm={this.handleDeleteModule}>
                    <Icon className="tms-module-delete" type="close" />
                </Popconfirm>
            </div>)
        )
    }
}