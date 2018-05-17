import React from 'react';
import { DragSource } from 'react-dnd';

const boxSource = {
	beginDrag(props) {
        const { type, id, code, name, coverImg } = props;
		return { type, id, code, name, coverImg };
	}
}

@DragSource('module', boxSource, connect => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
}))
export default class DragBox extends React.Component {
    componentDidMount() {
        const { coverImg, connectDragPreview } = this.props;
        const img = new Image();
        img.onload = () => connectDragPreview(img);
        img.src = `${coverImg}@270w.png`;
    }
    
    render() {
        const { children, connectDragSource } = this.props;
        return connectDragSource(children);
    }
}