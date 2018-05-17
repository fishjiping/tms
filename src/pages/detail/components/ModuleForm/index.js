import React from 'react';
import { Icon } from 'antd';
import Global from './Global.jsx';
import Banner from './Banner.jsx';
import DoubleBanner from './DoubleBanner.jsx';
import Coupon from './Coupon.jsx';
import DoubleCoupon from './DoubleCoupon.jsx';
import ItemLR from './ItemLR.jsx';
import ItemTB from './ItemTB.jsx';
import ThreeColumnItem from './ThreeColumnItem.jsx';
import HotItem from './HotItem.jsx';
import PresellItem from './PresellItem.jsx';
import MultiplePresellItem from './MultiplePresellItem.jsx';
import ItemCategory from './ItemCategory.jsx';
import SeckillCategory from './SeckillCategory.jsx';
import Text from './Text.jsx';
import FixedBar from './FixedBar.jsx';
import './index.less';

const ComponentList = {
    Global,
    Banner,
    DoubleBanner,
    Coupon,
    DoubleCoupon,
    ItemLR,
    ItemTB,
    ThreeColumnItem,
    HotItem,
    PresellItem,
    MultiplePresellItem,
    ItemCategory,
    SeckillCategory,
    Text,
    FixedBar
}

export default function ModuleForm (props) {
    const { baseInfo, data, handleHideCheckedModuleState } = props;
    const { id, code, name, uid } = baseInfo;
    const ComponentName = ComponentList[code];

    return (
        <div className="module-form" draggable="false">
            <div className="module-form-title">
                {id === -1 ? '全局' : name}设置
                <Icon className="module-form-close" type="close" onClick={handleHideCheckedModuleState} />
            </div>
            <div className="module-form-content"><ComponentName {...data} uid={uid} /></div>
        </div>
    );
}