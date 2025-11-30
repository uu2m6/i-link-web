const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://1c80585ee3e8.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})