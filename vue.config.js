const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true, 

  devServer: {
    proxy: {
      '/api': { 
        target: 'https://f26fff95887c.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})