const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成新的文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清楚文件 dist
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // css文件单独压缩
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DllPlugin = require("webpack/lib/DllPlugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HappyPack = require('happypack');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const os = require('os')
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); // 启动线程池});

// style-loader css-loader  一定要写 --save-dev  这样才会打包成功的  安装的时候

const entries = function () {
    const jsDir = path.resolve('src/pages')
    const entryFiles = glob.sync(jsDir + '/*.{js}');
    // console.log(entryFiles, 'entryFiles', jsDir);
    const map = {};

    for (let i = 0; i < entryFiles.length; i++) {
        let filePath = entryFiles[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    // console.log(map, 'map');
    return map;
}
// console.log(entries(), 'ent===========');
module.exports = {
    entry: {
        // ...entries
        index: ['./src/index.js', './src/router.js']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash:4].js',
        // library: '[name]_[chunkhash]',
        publicPath: './'
    },
    module: {
        rules: [
                {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['transform-runtime'],
                        presets: ['latest', 'react']
                    }
                }
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: false
                        }
                    }, {
                        loader: 'less-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.join(__dirname + '/postcss.config.js')
                            }
                        }
                    }]
                })
            }
        ]
    },
    // externals: {  //  用來解決外部cdn之類的情況
    //     'react': 'React',
    //     'react-router': 'ReactRouter',
    // },
    // devServer: {
    //     contentBase: path.join(__dirname, 'dist/index.html'),
    //     // compress: true,
    //     port: 9000,
    //     open: true,
    //     publicPath: '/'
    // },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // new CleanWebpackPlugin('./dist'),
        new HtmlWebpackPlugin({
            title: 'test',
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body',
            minify: {
                // removeComments: true
            },
            // excludeChunks: ['one']   // 不引入的js 文件
        }),
        // new AddAssetHtmlPlugin({
        //     filepath: path.resolve('./dist/js/vendor'),
        // }),
        // new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('[name].[chunkhash:4].css'),
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ['vender', 'runtime']
        // }),
        new webpack.DllReferencePlugin({
            manifest: require('./dist/manifest.json'), // 指定manifest.json
            name: 'vendor',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
        }),
        new ManifestPlugin({
            // publicPath: '../',
            fileName: 'manifest.json'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new BundleAnalyzerPlugin(),

        // new HappyPack({
        //     id: 'js',
        //     cache: true,
        //     threadPool: HappyThreadPool,
        //     loaders: ['babel-loader']
        // })
    ]
};


// npm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env webpack