const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://b36197b2cb7b.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})