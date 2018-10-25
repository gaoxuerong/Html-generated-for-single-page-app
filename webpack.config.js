const path = require('path')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');//压缩代码的
const ExtractTextPlugin = require('extract-text-webpack-plugin');//分离出css文件
const DefinePlugin = require('webpack/lib/DefinePlugin');//这个插件用来定义全局变量，在webpack打包的时候会对这些变量做替换。
const { WebPlugin } = require('web-webpack-plugin');//生成html
module.exports = {
  entry: {
    app: './main.js'
  },
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize'] // ?minimize压缩 CSS 代码
        }),
      },
    ]
  },
  plugins: [
    new WebPlugin({
      template: './template.html', 
      filename: 'index.html' 
    }),
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 hash 值
    }),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production 去除 react 代码中的开发时才需要的部分
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new UglifyJsPlugin({
      // 最紧凑的输出
      beautify: true,
      // 删除所有的注释
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    }),
  ],
}