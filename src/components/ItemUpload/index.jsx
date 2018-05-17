import React from 'react'
import { message, Popover, Button, Upload } from 'antd'
import moment from 'moment'
import Ajax from '../../libs/ajax'
import API from '../../libs/api';
import './index.less'

class ItemUpload extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: 0,
            visible: false,
            finished: true,
            taskInfo: {}
        }
    }

    handlerClick (e) {
        e.stopPropagation();
    }

    handleVisibleChange = (visible) => {
        if (visible === false) {
            this.setState({ visible: false });
        }
    }

    getProgressNum (taskId) {
        Ajax.get(API.item.uploadProgress, { 
            params: { taskId }
         }).then(res => {
            if (res.status) {
                if (!res.entry.isFinished) {
                    this.setState({ progress: res.entry.progress });
                    let timer = setTimeout(() => {
                        this.getProgressNum(taskId);
                        clearTimeout(timer);
                    }, 1000);
                } else {
                    this.setState({ progress: 100 });
                    this.getImportResult();
                }
            } else {
                this.setState({ finished: true });
                message.error(res.message || '上传进度获取失败');
            }
        });
    }

    getImportResult (taskId) {
        Ajax.get(API.item.uploadResult, { 
            params: { taskId }
        }).then(res => {
            if (res.status) {
                const entry = res.entry;
                if (entry && entry.itemList) {
                    this.setState({
                        taskInfo: entry.itemList[0],
                        visible: true,
                        finished: true
                    });
                } else {
                    this.setState({ finished: true });
                    message.error('无数据返回');
                }  
            } else {
                this.setState({ finished: true });
                message.error(res.message || '数据获取失败');
            }
        });
    }

    renderStatusTpl (taskInfo) {
        if (!taskInfo.progressBar) return null;

        const progressBar = JSON.parse(taskInfo.progressBar);
        const errorInfoUrl = taskInfo.errorInfoUrl;
        const sStatus = taskInfo.sStatus;
        const hasError = taskInfo.hasError;
        let statusTpl = null;

        if (sStatus == 9 && errorInfoUrl) {
            statusTpl = '导入状态：失败';
        } else {
            if (sStatus == 3 && errorInfoUrl) {
                statusTpl = '导入状态：完成，部分失败';
            } else if (sStatus == 3 && !errorInfoUrl) {
                statusTpl = '导入状态：成功';
            } else if (sStatus == 2 && hasError) {
                statusTpl = '导入状态：导入中 ' + progressBar.progress + '% ' + '(有故障)';
            } else if (sStatus == 2 && !hasError) {
                statusTpl = '导入状态：导入中 ' + progressBar.progress + '% ';
            }
        }

        return statusTpl;
    }

    renderDownloadTpl(taskInfo) {
        const sStatus = taskInfo.sStatus
        const errorInfoUrl = taskInfo.errorInfoUrl
        let downloadTpl = null

        if (sStatus == 2) {
            downloadTpl = '-';
        } else {
            downloadTpl = (
                <p style={{ marginTop: 16 }}>
                    <a href={taskInfo.downloadUrl}>下载</a>
                    {
                        errorInfoUrl
                        ? <a href={errorInfoUrl} style={{ marginLeft: 16 }}>下载失败数据</a>
                        : null
                    }
                </p>
            );
        }

        return downloadTpl;
    }

    get uploadConfig() {
        const { btnText, onChange, ...uploadConfig } = this.props;
        uploadConfig.onChange = (info) => {
            const data = info.file;
            if (data.status === 'error') {
                message.error('上传失败！');
            } else if (data.response) {
                if (data.response.status) {
                    onChange && onChange(data.response.entry);
                    this.setState({
                        progress: 0,
                        finished: false
                    });
                    this.getProgressNum(data.response.entry.taskId);
                } else {
                    message.error(data.response.message || '上传失败！');
                }
            }
        };
        return uploadConfig;
	}
  
    render () {
        const {
            progress,
            finished, 
            taskInfo, 
            visible
        } = this.state;
        const { btnText } = this.props;
        const content = (
            <div className="import-result">
                <p>导入时间： {moment(taskInfo.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</p>
                <p>{this.renderStatusTpl(taskInfo)}</p>
                {this.renderDownloadTpl(taskInfo)}
            </div>
        );

        return (
            <Upload {...this.uploadConfig} >
                <div className="progress-btn-wrapper" style={this.props.style}>
                    {
                        finished
                        ? <Popover 
                                placement="bottom" 
                                content={content} 
                                trigger="click"
                                visible={visible}
                                onVisibleChange={this.handleVisibleChange}
                            >
                                <Button>{btnText}</Button>
                            </Popover>    
                        : <div className="importing-btn" onClick={this.handlerClick}>
                            <span style={{ width: `${progress}%` }}></span>
                            <em>{progress == 100 ? '导入完成' : '导入中'} {progress}%</em>
                        </div>
                    }
                </div>
            </Upload>
        );
    }
}

ItemUpload.defaultProps = {
    btnText: '导入商品'
}

export default ItemUpload;