// banner默认数据
const Banner = {
    picList: [
        {
            pic: '',
            link: ''
        }
    ],
    height: '',
    marginBottom: 20
}

// 一行两栏banner默认数据
const DoubleBanner = {
    picList: [
        {
            pic: '',
            link: ''
        },
        {
            pic: '',
            link: ''
        }
    ],
    marginBottom: 20
}

// 优惠券默认数据
const Coupon = {
    couponList: [], 
    nameColor: '#FA4100', 
    titleColor: '#333', 
    validityColor: '#999', 
    bgColor: '#FFECE5', 
    btnColor: '#fff', 
    btnBgColor: '#FA4100',
    marginBottom: 20
};

// 一行两栏优惠券默认数据
const DoubleCoupon = {
    couponList: [], 
    nameColor: '#FA4100', 
    titleColor: '#333', 
    validityColor: '#999', 
    bgColor: '#FFECE5', 
    btnColor: '#fff', 
    btnBgColor: '#FA4100',
    marginBottom: 20 
};

// 商品列表一默认数据
const ItemLR = {
    title: '',
    titleColor: '#333',
    btnFontColor: '#fff',
    btnColor: '#FF3168',
    marginBottom: 20,
    activityId: '',
    taskId: ''
};

// 商品列表二默认数据
const ItemTB = {
    title: '',
    titleColor: '#333',
    btnColor: '#FF3168',
    marginBottom: 20,
    activityId: '',
    taskId: ''
};

// 3栏商品组件
const ThreeColumnItem = {
    title: '',
    titleColor: '#333',
    btnColor: '#FF3168',
    marginBottom: 20,
    activityId: '',
    taskId: ''
};

// 特殊单品1默认数据
const HotItem = {
    styleType: 'red', 
    nameColor: '#2C2C2C',
    descColor: '#656565',
    bgColor: '#FFF0F0',
    addBtnColor: '#fff',
    addBtnBgColor: '#E11519',
    marginBottom: 20,
    activityId: '',
    taskId: '',
    styleMap: {
        red: {
            styleType: 'red', 
            nameColor: '#2C2C2C',
            descColor: '#656565',
            bgColor: '#FFF0F0',
            addBtnColor: '#fff',
            addBtnBgColor: '#E11519',
        },
        green: {
            styleType: 'green', 
            nameColor: '#2C2C2C',
            descColor: '#656565',
            bgColor: '#F0FEFF',
            addBtnColor: '#fff',
            addBtnBgColor: '#E11557',
        },
        yellow: {
            styleType: 'yellow', 
            nameColor: '#2C2C2C',
            descColor: '#656565',
            bgColor: '#FFF9F0',
            addBtnColor: '#fff',
            addBtnBgColor: '#E11557',
        }
    }
};

// 单预售活动
const PresellItem = {
    countDownTitleColor: '#fff',
    countDownTitleBgColor: '#ff3168',
    countDownTimeColor: '#ff466c',
    countDownTimeBgColor: '#fff',
    notStartBtnColor: '#ff3168',
    processBtnColor: '#ff3168',
    finishedBtnColor: '#ff3168',
    notStartBtnFontColor: '#fff',
    processBtnFontColor: '#fff',
    finishedBtnFontColor: '#fff',
    marginBottom: 20,
    activityId: '',
    taskId: ''
}

// 多时间段预售活动组件
const MultiplePresellItem = {
    bgColor: '#fff',
    selectedBgColor: '#FF3168',
    color: '#333',
    selectedColor: '#fff',
    countDownTitleColor: '#000',
    countDownTimeColor: '#fff',
    countDownTimeBgColor: '#4A4A4A',
    notStartBtnColor: '#ff3168',
    processBtnColor: '#ff3168',
    finishedBtnColor: '#ff3168',
    notStartBtnFontColor: '#fff',
    processBtnFontColor: '#fff',
    finishedBtnFontColor: '#fff',
    marginBottom: 20,
    activityId: '',
    taskId: ''
}

// 商品类目默认数据
const ItemCategory = {
    bgColor: '#fff',
    fontColor: '#333',
    selectedFontColor: '#FFA900',
    selectedUnderlineColor: '#FFA900',
    arrowColor: '#ccc',
    btnColor: '#FF3168',
    marginBottom: 20,
    activityId: '',
    taskId: '',
    // lr表示单栏商品组件,tb表示双栏商品组件,tc表示3蓝商品组件
    arrangementMode: 'tb'
};

// 秒杀类目默认数据
const SeckillCategory = {
    color: '#fff',
    selectedColor: '#fff',
    bgColor: '#333',
    selectedBgColor: '#FA4100',
    btnColor: '#FF3168',
    marginBottom: 20,
    activityId: '',
    taskId: '',
    // lr表示单栏商品组件,tb表示双栏商品组件,tc表示3蓝商品组件
    arrangementMode: 'lr'
};

const Text = {
    fontSize: 28,
    color: '#333',
    textAlign: 'left',
    content: '',
    marginBottom: 20
};

const FixedBar = {
    pic: '',
    link: '',
    height: ''
};

export const defaultData = {
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