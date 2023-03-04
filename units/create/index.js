import createHtml from "./createHtml.js";
import createMainJs from "./createMainJs.js";
import createViteConfigJs from "./createViteConfigJs.js";
import createAppTemplate from "./createAppTemplate.js";
import createVueModuleComponentTemplate from './createVueModuleComponentTemplate.js'
import createLibraryModeIndex from "./createLibraryModeIndex.js";
import writeFileSync from "../outher/writeFileSync.js";
import mkdirRecursive from "../outher/mkdirRecursive.js";

export default function createEvery(res = {}) {
    // console.log(res);
    mkdirRecursive(`${res.modulePath}/router`)
    writeFileSync(`${res.modulePath}/index.html`, createHtml(res))
    writeFileSync(`${res.modulePath}/main.js`, createMainJs(res))
    writeFileSync(`${res.modulePath}/vite.js`, createViteConfigJs(res))
    writeFileSync(`${res.modulePath}/App.vue`, createAppTemplate(res))
    mkdirRecursive(`${res.modulePath}/components`)
    writeFileSync(`${res.modulePath}/components/${res.camelName}.vue`, createVueModuleComponentTemplate(res))
    if (res.moduleType === 'library') writeFileSync(`${res.modulePath}/index.js`, createLibraryModeIndex(res))
    console.log('\u2795  \x1B[2m 模块位置', res.modulePath, '\x1B[0m');

}
