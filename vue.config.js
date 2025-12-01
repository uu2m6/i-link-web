const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://654ea56918f9.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})