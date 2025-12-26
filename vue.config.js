const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://66b993ad36c7.ngrok-free.app', //작은 따옴표 안에 API링크 삽입
        changeOrigin: true,
      }
    }
  }
})