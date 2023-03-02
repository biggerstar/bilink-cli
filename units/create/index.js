import createHtml from "./createHtml.js";
import createMainJs from "./createMainJs.js";
import createVueTemplate from "./createVueTemplate.js";
import createViteConfigJs from "./createViteConfigJs.js";
import createVueHelloTemplate from './createVueHelloTemplate.js'
import createLibraryModeIndex from "./createLibraryModeIndex.js";
import writeFileSync from "../writeFileSync.js";
import mkdirRecursive from "../mkdirRecursive.js";

export default function createEvery(res = {}) {
    // console.log(res);
    mkdirRecursive(`${res.modulePath}/view`)
    mkdirRecursive(`${res.modulePath}/router`)
    writeFileSync(`${res.modulePath}/index.html`, createHtml(res))
    writeFileSync(`${res.modulePath}/main.js`, createMainJs(res))
    writeFileSync(`${res.modulePath}/vite.js`, createViteConfigJs(res))
    writeFileSync(`${res.modulePath}/${res.camelName}.vue`, createVueTemplate(res))
    writeFileSync(`${res.modulePath}/view/Hello.vue`, createVueHelloTemplate(res))
    if (res.moduleType === 'library') writeFileSync(`${res.modulePath}/index.js`, createLibraryModeIndex(res))
    console.log('\u2795  \x1B[2m 模块位置', res.modulePath, '\x1B[0m');

}
