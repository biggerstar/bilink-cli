export default function createViteConfigJs(res) {
    const inputField = res.moduleType === 'normal' ? `
    /* 普通开发模式下，可以在input中修改打包入口 */
    //input : path.resolve(process.cwd(),'src/modules/${res.camelName}/index.html'),` : ''

    return `import vue from '@vitejs/plugin-vue'
import path from "path";

/* 该配置和vite.config.js配置完全一致，并且该配置只适用于同目录下的微模块，模块间互不影响 */
export default {
  name: "${res.camelName}",
  version: "${res.version}",
  moduleType: "${res.moduleType}",
  typeOutDir: "${res.moduleType}", // 默认编译输出分类文件夹
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  build: {
    rollupOptions: { ${inputField}
      external: ['vue'],   // 如果只打包单组件无需打包第三方库，则在这里将其排除不进行打包
    }
  },
  server: {
    host: '0.0.0.0',
    https:true, // 内置了证书可以直接使用https
  },
}`
}
