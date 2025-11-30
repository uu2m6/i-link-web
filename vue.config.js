const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://1b1a8d606663.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})