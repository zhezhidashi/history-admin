const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
        '/api': {
            target: 'https://room_dev_admin.pacificsilkroad.cn/api-service',
            pathRewrite: {'^/api': ''},
            ws: true,
            changeOrigin: true
        },
    },
  },
})
