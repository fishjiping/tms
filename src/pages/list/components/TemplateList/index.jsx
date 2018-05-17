import React from 'react';
import { Pagination, Spin } from 'antd';
import { H5_HOST, H5_HOST_HTTPS } from '../../../../libs/util';
import TemplateItem from './TemplateItem';
import './index.less';

export default function TemplateList (props) {
    // type: 1表示官方模板，2表示我的模板，3表示我的页面
    const { 
        type, 
        list, 
        pagination, 
        loading 
    } = props;
    const { 
        pageSize, 
        total 
    } = pagination;
    
    return (
        <Spin spinning={loading}>
            <div className="template-list clearfix">
                <div>
                    {
                        list && list.length > 0 
                        ? list.map((item, i) => {
                            let url;
                            let qrcodeUrl;
                            let { coverImg } = JSON.parse(item.attrs);

                            if (!coverImg) {
                                return;
                            } else {
                                if (location.hostname.indexOf('daily') !== -1) {
                                    coverImg = `//imgdaily.52shangou.com/img/${coverImg}`;
                                } else {
                                    coverImg = `//imgsize.52shangou.com/img/${coverImg}`;
                                }
                            }

                            if (type === 3) {
                                url = H5_HOST_HTTPS + item.pageMap.pub.ossFilePath;
                                qrcodeUrl = H5_HOST +item.pageMap.pub.ossFilePath;
                            } else {
                                url = coverImg;
                                qrcodeUrl = `http:${coverImg}`;
                            }

                            return (
                                <TemplateItem 
                                    key={item.id} 
                                    {...item} 
                                    type={type} 
                                    coverImg={coverImg} 
                                    url={url} 
                                    qrcodeUrl={qrcodeUrl} 
                                />
                            );
                        }) 
                        : <p className="template-placeholder">{type == 1 ? '暂无模板' : '暂无页面' }</p>
                    }
                </div>
                {total > pageSize && <Pagination {...pagination} />}
            </div>
        </Spin>
    );
}
