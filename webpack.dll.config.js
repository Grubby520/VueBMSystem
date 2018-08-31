const path = require('path')
const webpack = require('webpack')

const project = require('./webpack.folder.config').project
const buildType = require('./webpack.folder.config').buildType
const distDir = /dll-build/.test(buildType) ? require('./webpack.folder.config').distDir : path.resolve(process.cwd(), 'dist/' + project)
const pkg = require('./package.json')

let vendors = Object.keys(pkg.dependencies || [])

console.log('>vendors:' + JSON.stringify(vendors))

let config = {
  entry: {
    'js/dll.vendor': vendors
  },
  output: {
    library: 'vendor'
  },
  module: {
    rules: [
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      // context: path.resolve(process.cwd()),
      name: '[name]',
      path: path.join(__dirname, 'manifest.json')
    })
  ]
}

if (/dll/.test(buildType)) {
  config.output = {
    path: distDir,
    filename: '[name].js',
    library: 'vendor' // 影响 生成的dll.js文件 var 的部分
  },
  webpack(config, (err, stats) => {
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
} else {
  module.exports = config
}
