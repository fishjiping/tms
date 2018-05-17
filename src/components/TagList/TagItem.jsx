import React from 'react';

export default class TagItem extends React.PureComponent {
    handleChange = () => {
        const { checked, code } = this.props;

        if (!checked) {
            this.props.handleChangeTag(code);
        }
    }
  
    render() {
        const { name, checked } = this.props;
        return (
            <li 
                className={checked ? 'tag-item tag-item-active' : 'tag-item'} 
                onClick={this.handleChange}
            ><span className="tag-text">{name}</span></li>
        );
    }
}