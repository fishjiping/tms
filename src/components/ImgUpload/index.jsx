import React from 'react';
import { Upload, Button, message } from 'antd';
import API from '../../libs/api';
import './index.less';

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    if (!isJPG) {
        message.error('只允许上传jpg、png格式图片!');
    }
    const isLt2M = file.size / 1024 / 200;
    if (!isLt2M) {
        message.error('图片必须小于200KB！');
    }
    return isJPG && isLt2M;
}

export default function ImgUpload(props) {
    const { text, onChange } = props;

    return (
        <Upload
            className="img-uploader"
            name="file"
            showUploadList={false}
            action={API.img.upload}
            beforeUpload={beforeUpload}
            onChange={onChange}
        >
            <Button>{text}</Button>
        </Upload>
    );
}