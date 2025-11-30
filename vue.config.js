const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://a9c638c029b8.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})