import createHtml from "./createHtml.js";
import createMainJs from "./createMainJs.js";
import createVueTemplate from "./createVueTemplate.js";
import createViteConfigJs from "./createViteConfigJs.js";
import createVueHelloTemplate from './createVueHelloTemplate'
import writeFileSync from "../writeFileSync.js";
import mkdirRecursive from "../mkdirRecursive.js";
export default function createEvery(res) {
    mkdirRecursive(`${res.modulePath}/view`)
    writeFileSync(`${res.modulePath}/index.html`, createHtml(res))
    writeFileSync(`${res.modulePath}/main.js`, createMainJs(res))
    writeFileSync(`${res.modulePath}/vite.js`, createViteConfigJs(res))
    writeFileSync(`${res.modulePath}/${res.camelName}.vue`,createVueTemplate(res) )
    writeFileSync(`${res.modulePath}/view/Hello.vue`, createVueHelloTemplate())
}
