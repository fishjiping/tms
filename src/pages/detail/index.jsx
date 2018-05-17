import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, observer, inject } from 'mobx-react';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Stores from '../../stores/detailStore';
import ModuleList from './components/ModuleList';
import Template from './components/Template';
import OperatorBtns from './components/OperatorBtns';
import './index.less'; 

@DragDropContext(HTML5Backend)
class Detail extends React.Component {
	render() {
		return (
			<div>
				<ModuleList />
                <Template />
                <OperatorBtns />
			</div>
		)
	}
}

const store = new Stores();

ReactDOM.render(<Provider store={store} ><Detail/></Provider>, document.getElementById('root'));