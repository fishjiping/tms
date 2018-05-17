import React from 'react';
import TagItem from './TagItem';

export default class TagList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checkedIndex: 0 } 
    }

    handleChange = (code) => {
        const { checkedIndex } = this.state;
        const { list, handleChangeTag } = this.props;
        let index;

        list.forEach(function (item, i) {
            if (item.code === code) {
                index = i;
            }
        });

        if (checkedIndex !== index) {
            this.setState({ checkedIndex : index });
            handleChangeTag(code);
        }
    }
  
    render() {
        const { checkedIndex } = this.state;
        const { list } = this.props;

        if (list && list.length > 0) {
            return (
                <ul className="tag-list clearfix">
                    {
                        list.map((item, i) => {
                            return <TagItem key={item.code} {...item} checked={i === checkedIndex} handleChangeTag={this.handleChange} />;
                        })
                    }
                </ul>
            );
        } else {
            return null;
        }
    }
}