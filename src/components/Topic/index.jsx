import React from 'react';
import './index.less';

export default function Topic(props)  {
    return (
        <div className="topic">
            <h4 className="text">{props.title}</h4>
            <div className="extra">{props.extraContent}</div>
        </div>
    );
}