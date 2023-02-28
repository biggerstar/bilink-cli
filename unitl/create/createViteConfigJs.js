export default function createViteConfigJs(res) {
    return `import vue from '@vitejs/plugin-vue'
import path from "path";

/* 该配置和vite.config.js配置完全一致，并且该配置只适用于同目录下的微模块，模块间互不影响 */
export default {
  name: "${res.camelName}",
  version: "${res.version}",
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  },
  server: {
    host: '0.0.0.0',
    https:true, // 内置了证书可以直接使用https
  },
}`
}
