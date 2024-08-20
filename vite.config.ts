import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { PROXY_URL } from './src/config'


export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3915,
    proxy: {
      '/api': {
        target: PROXY_URL, 
        changeOrigin: true, 
        rewrite: path => path.replace(/^\/api/, ''),
      },
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  },
  // 全局 css 注册
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/style/index.scss";`
      }
    }
  },
  
})
