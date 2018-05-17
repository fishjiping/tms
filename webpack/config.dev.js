const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');

function getCustomTheme() {
    let theme = {};

    if (pkg.them && typeof pkg.theme === 'string') {
        let theme_path = pkg.theme;
        if (theme_path.charAt(0) === '.') {
            theme_path = path.resolve(process.cwd(), theme_path);
        }

        theme = require(theme_path);
    }

    return theme;
}

const __customTheme__ = getCustomTheme();
const contextPath = path.resolve('../', __dirname);

module.exports = {
    devtool: 'source-map',
    context: contextPath,
    entry: {
        "list": ["webpack-hot-middleware/client?reload=true", "../src/pages/list/index.jsx"],
        "detail": ["webpack-hot-middleware/client?reload=true", "../src/pages/detail/index.jsx"]
    },
    resolve: {
        // 当require的模块找不到时，自动添加这些后缀
        extensions: ['.js', '.jsx', '.less']
    },
    output: {
        path: path.resolve(contextPath, '../build'),
        filename: '[name].js',
        // 用于本地开发的静态目录
        publicPath: '/dist/'
    },
    plugins: [
        // 根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id, 使得ids可预测，降低文件大小，该模块推荐使用
        new webpack.optimize.OccurrenceOrderPlugin(),

        // 限制打包文件的个数
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),

        // 把多个小模块进行合并，以减少文件的大小
        new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 8192 }),

        // 定义node的打包环境
        new webpack.DefinePlugin({
            "process.env": {NODE_ENV: JSON.stringify('development')},
            DEBUG: true
        }),

        // 热替换
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js|\.jsx$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['transform-decorators-legacy'],
                    cacheDirectory: true
                }
            }
        }, {
            test: /antd\/.*\.less$/,
            use: ['style-loader', 'css-loader', `less-loader?{"sourcemap": true, "modifyVars": ${JSON.stringify(__customTheme__)}}`]
        }, {
            test: /\.(jpg|png|gif|webp)$/,
            use: ['url?limit=8192']
        }, {
            test(filePath) {
                return /\.less$/.test(filePath) && !/antd\/.*\.less$/.test(filePath);
            },
            use: ['style-loader', 'css-loader', 'less-loader']
        }]
    }
}