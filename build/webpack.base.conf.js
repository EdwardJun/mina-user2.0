var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var MpvuePlugin = require('webpack-mpvue-asset-plugin')
var glob = require('glob')
/* 新增----start----- */
var CopyWebpackPlugin = require('copy-webpack-plugin')
var configFilesArray = []
/* 新增-----end---- */
var relative = require('relative');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

/* function getEntry (rootSrc, pattern) {
  var files = glob.sync(path.resolve(rootSrc, pattern))
  return files.reduce((res, file) => {
    var info = path.parse(file)
    var key = info.dir.slice(rootSrc.length + 1) + '/' + info.name
    res[key] = path.resolve(file)
    return res
  }, {})
} */
/* 新增----start----- */
function getEntry(rootSrc) {
  var map = {};
  //fileArray 自定义打包入口分包
  var fileArray = ['pages', 'subPackage', 'groups', 'subSeckill', 'bargain', 'subRefund', 'subCoupon'];
  fileArray.map(name => {
      glob.sync(rootSrc + `/${name}/**/main.js`).forEach(file => {
          var key = relative(rootSrc, file).replace('.js', '');
          map[key] = file;
      });
      glob.sync(rootSrc + `/${name}/**/main.json`).forEach(file => {
          configFilesArray.push({
              from: file,
              to: relative(rootSrc, file)
          });
      });
  });
  return map;
}
/* 新增-----end---- */

const appEntry = { app: resolve('./src/main.js') }
/* 新增----start----- */
configFilesArray.push({
  from: resolve('./src/main.json'),
  to: 'app.json'
})
/* 新增-----end---- */
const pagesEntry = getEntry(resolve('./src'), 'pages/**/main.js')
const entry = Object.assign({}, appEntry, pagesEntry)

module.exports = {
  // 如果要自定义生成的 dist 目录里面的文件路径，
  // 可以将 entry 写成 {'toPath': 'fromPath'} 的形式，
  // toPath 为相对于 dist 的路径, 例：index/demo，则生成的文件地址为 dist/index/demo.js
  entry,
  target: require('mpvue-webpack-target'),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'mpvue',
      '@': resolve('src'),
      'asset': resolve('src/asset')
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'mpvue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        include: [resolve('src'), resolve('test')],
        use: [
          'babel-loader',
          {
            loader: 'mpvue-loader',
            options: {
              checkMPEntry: true
            }
          },
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name]].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new MpvuePlugin(),
    /* 新增----start----- */
    new CopyWebpackPlugin(configFilesArray)
    /* 新增-----end---- */
  ]
}
