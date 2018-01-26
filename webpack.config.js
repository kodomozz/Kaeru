const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成新的文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清楚文件 dist
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // css文件单独压缩
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const DllPlugin = require("webpack/lib/DllPlugin");

// style-loader css-loader  一定要写 --save-dev  这样才会打包成功的  安装的时候

const entries = function () {
    const jsDir = path.resolve('src/pages')
    const entryFiles = glob.sync(jsDir + '/*.{js}');
    console.log(entryFiles, 'entryFiles', jsDir);
    const map = {};

    for (let i = 0; i < entryFiles.length; i++) {
        let filePath = entryFiles[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    console.log(map, 'map');
    return map;
}
console.log(entries(), 'ent===========');
module.exports = {
    entry: {
        // ...entries
        index: ['./src/index.js', './src/router.js'],
        vendor: ['react', "react-router"]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash:4].js',
        // library: '[name]_[chunkhash]',
        publicPath: '/'
    },
    module: {
        rules: [
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
    devServer: {
        contentBase: path.join(__dirname, 'dist/index.html'),
        // compress: true,
        port: 9000,
        open: true,
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin('./dist'),
        new HtmlWebpackPlugin({
            title: 'test',
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body',
            minify: {
                // removeComments: true
            },
            // excludeChunks: ['one']   // 不引入的js 文件
        }),
        // new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('[name].[chunkhash:4].css'),
        new webpack.optimize.CommonsChunkPlugin({ names: ['vender', 'runtime'] }),
        new ManifestPlugin({
            // publicPath: '../',
            fileName: 'manifest.json'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ]
};