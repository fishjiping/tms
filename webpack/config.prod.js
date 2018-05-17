const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

function getCustomTheme() {
    let theme = {};

    if (pkg.theme && typeof pkg.theme === 'string') {
        let theme_path = pkg.theme;
        if (theme_path.charAt(0) === '.') {
            theme_path = path.resolve(process.cwd(), theme_path);
        }
        theme = require(theme_path)();
    }

    return theme;
}

const __customTheme__ = getCustomTheme();
const contextPath = path.resolve('../', __dirname);

module.exports = {
    devtool: false,
    context: contextPath,
    entry: {
        "list": ["../src/pages/list/index.jsx"],
        "detail": ["../src/pages/detail/index.jsx"]
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
            "process.env": { NODE_ENV: JSON.stringify('production') },
            DEBUG: false
        }),

        // 压缩JS
        new webpack.optimize.UglifyJsPlugin({
            compressor: { warnings: false },
            output: { comments: false }
        }),
        // 提取公共文件
        new CommonsChunkPlugin({name: "common"}),
        new ExtractTextPlugin("[name].css")
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
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ['css-loader', `less-loader?{"sourceMap": true, "modifyVars": ${JSON.stringify(__customTheme__)}}`]
            })
        }, {
            test: /\.(jpg|png|gif|webp)$/,
            use: ['url?limit=8192']
        }, {
            test(filePath) {
                return /\.less$/.test(filePath) && !/antd\/.*\.less$/.test(filePath);
            },
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", 'less-loader']
            })
        }]
    },
    externals: {
        "react": 'window.React',
        "react-dom": 'window.ReactDOM'
    }
}