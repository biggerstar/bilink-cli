export default function createLibraryModeIndex(res) {
    return `// 用于构建单组件库导出对应模块，同模块工程下可导出多个.vue组件供外部引入使用,该文件只会在library模式中被创建
import ${res.camelName} from './${res.camelName}.vue'

const components = {
    ${res.camelName},
}
const install = (app) =>{
    if (install.installed) return
    install.installed = true
    Object.keys(components).forEach(name => app.component(name, components[name]));
}
export default {
    install,
    ...components,
}
`

}




