const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'http://localhost:8000', // 백엔드 서버 주소
        changeOrigin: true,
      }
    }
  }
})