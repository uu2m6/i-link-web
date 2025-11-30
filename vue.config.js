const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://4425bad943c6.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})