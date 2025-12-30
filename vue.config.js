const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://191a70116f30.ngrok-free.app', //작은 따옴표 안에 API링크 삽입
        changeOrigin: true,
      }
    }
  }
})