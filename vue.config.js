const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
        '/api': {
            target: 'http://xks.pku.edu.cn:443/api-service/',
            pathRewrite: {'^/api': ''},
            ws: true,
            changeOrigin: true
        },
    },
  },
})
