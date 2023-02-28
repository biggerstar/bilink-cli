import glob from "glob";

/** 解析出微模块的名称*/
export const parseModuleName = (filePath) => {
    const reg = new RegExp(`src\/modules\/(.+)\/.?`)
    const componentMatch = filePath.toString().match(reg)
    if (Array.isArray(componentMatch)) { /* 对组件进行分包 */
        return componentMatch[1]
    }
    return null
}

/** 检测是否已经存在模块 */
export default function existModule(inputModuleName) {
    const allModulePath = glob.sync(`${process.env.PWD}/src/modules/?**/`)
    const modules = allModulePath.map(path => parseModuleName(path).toLowerCase())
    if (modules.includes(inputModuleName.toLowerCase())) {
        console.log('  => \x1B[41m \x1B[37m' + inputModuleName + '  \x1B[0m  \x1B[33m微模块已经存在，请重新起名\x1B[0m')
        return true
    }
    return false
}
