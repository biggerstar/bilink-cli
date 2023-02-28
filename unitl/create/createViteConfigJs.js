export default function createViteConfigJs(res) {
    return `import vue from '@vitejs/plugin-vue'
import path from "path";

export default {
  name: "${res.camelName}",
  version: "${res.version}",
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  }
}`
}
