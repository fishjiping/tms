import React from 'react';
import { SketchPicker } from 'react-color';
import './index.less';

export default class ColorPick extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false
        };
    }
  
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };
  
    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };
  
    handleChange = (color) => {
        this.props.onChange(color.hex);
        this.setState({ displayColorPicker: false });
    };
  
    render() {
        const { displayColorPicker } = this.state;
        const { color } = this.props
        
        return (
            <div className="color-pick-block">
                <div className="color-pick-btn"  onClick={ this.handleClick }>
                    <div className="color-pick-color" style={{ backgroundColor: color }} />
                </div>
                { 
                    displayColorPicker ?
                    <div className="color-pick-popover">
                        <div className="color-pick-cover" onClick={ this.handleClose }/>
                        <SketchPicker color={ color || '#ffffff' } onChange={ this.handleChange } />
                    </div> :
                    null 
                }
            </div>
        )
    }
}