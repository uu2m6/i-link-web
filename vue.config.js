const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://3d5de2897c58.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})