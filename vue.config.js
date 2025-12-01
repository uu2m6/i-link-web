const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://8735cd2499eb.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})