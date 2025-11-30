const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://98905c106a71.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})