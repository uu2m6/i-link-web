const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://7d7bc499f3f6.ngrok-free.app', //작은 따옴표 안에 API링크 삽입
        changeOrigin: true,
      }
    }
  }
})