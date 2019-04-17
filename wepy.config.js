const path = require('path')
var prod = process.env.NODE_ENV === 'production'
const projectConfig = require('./project.config.json') // 导入项目的配置文件

module.exports = {
  wpyExt: '.wpy',
  eslint: true,
  cliLogs: !prod,
  build: {},
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    aliasFields: ['wepy', 'weapp'],
    modules: ['node_modules']
  },
  compilers: {
    /* less: {
      compress: prod
    }, */
    sass: {
      outputStyle: 'compressed'
    },
    babel: {
      sourceMap: true,
      presets: ['env'],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-export-extensions'
      ]
    }
  },
  plugins: {},
  appConfig: {
    noPromiseAPI: ['createSelectorQuery'],
    appid: projectConfig.appid // 通过 wepy.$appConfig.appid 取值
  }
}

if (prod) {
  // 压缩sass
  module.exports.compilers['sass'] = { outputStyle: 'compressed' }

  // 压缩js
  module.exports.plugins = {
    uglifyjs: {
      filter: /\.js$/,
      config: {}
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }
  }
}
