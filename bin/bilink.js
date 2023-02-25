#!/usr/bin/env node
import {Command} from 'commander'
import fs from "fs"
import glob from "glob"
import inquirer from "inquirer"
import path from "path"
import lodash from "lodash"

function mkdirRecursive(dirname) {
    if (fs.existsSync(dirname)) return true
    if (mkdirRecursive(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
    }
}

function writeFileSync(path, data) {
    const pathHiera = path.split('/')
    if (pathHiera[pathHiera.length - 1].includes('.')) pathHiera.pop()
    mkdirRecursive(pathHiera.join('/'))
    if (!fs.existsSync(path)) fs.writeFileSync(path, data)
}

function createHtml(res) {
    const templateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>BI-LINK micro-app</title>
</head>
<body>
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
</body>
</html>
`
    const matchScriptSrc = /<script.+src\s?=\s?"(.+)".+<\/script>/
    const newModulePath = res.modulePath
    const srcPath = `/src/modules/${res.camelName}/main.js`  //相对于项目
    const newHtml = templateHtml.replace(matchScriptSrc, `<script type="module" src="${srcPath}"></script>`)
    writeFileSync(`${newModulePath}/index.html`, newHtml)
    // console.log(newModulePath);
}

function createBuildJson(res) {
    const json = {
        name: res.camelName,
        version: res.version
    }
    writeFileSync(`${res.modulePath}/build.json`, JSON.stringify(json, null, 2))
}

function createMainJs(res) {
    const script = `import {createApp} from 'vue'
import ${res.camelName} from './${res.camelName}.vue'
const app = createApp(${res.camelName})
app.mount('#app')`

    writeFileSync(`${res.modulePath}/main.js`, script)
}

function createVueTemplate(res) {
    const vueTemplate = `<template>\n
</template>
<script>
export default {
  name: "${res.camelName}"
}
</script>
<style scoped>
</style>`
    writeFileSync(`${res.modulePath}/${res.camelName}.vue`, vueTemplate)
}

function createEvery(res) {
    createHtml(res)
    createMainJs(res)
    createVueTemplate(res)
    createBuildJson(res)
}

/** 解析出微模块的名称*/
const parseModuleName = (filePath) => {
    const reg = new RegExp(`src\/modules\/(.+)\/.?`)
    const componentMatch = filePath.toString().match(reg)
    if (Array.isArray(componentMatch)) { /* 对组件进行分包 */
        return componentMatch[1]
    }
    return null
}

function existModule(inputModuleName) {
    const allModulePath = glob.sync(`${process.env.PWD}/src/modules/?**/`)
    const modules = allModulePath.map(path => parseModuleName(path).toLowerCase())
    if (modules.includes(inputModuleName)) {
        console.log('  => \x1B[41m \x1B[37m' + inputModuleName
            + '  \x1B[0m  \x1B[33m微模块已经存在，请重新起名\x1B[0m')
        return true
    }
    return false
}

const createLib = {
    init() {
        let isValidateDone = true
        return inquirer['prompt']([{
            message: '请输入要添加的模块名称: ', name: 'name', filter: (input) => {
                if (input.length <= 0 || existModule(input)) isValidateDone = false
                if (isValidateDone === false) input = ''
                return input
            }, validate: () => {
                const validateDone = isValidateDone
                isValidateDone = true
                return validateDone
            },
        }, {
            message: '请输入版本号: ', name: 'version', default: '1.0.0'
        },])
    }
}

function parseCli() {
    const packageConfig = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const version = packageConfig ? packageConfig.version : '1.0.0'  // 无伤大雅，不严谨懒得整
    const program = new Command();
    program
        .name('bilink')
        .description('用于创建一个新的微模块')
        .version(version);

    program.command('create')
        .description('创建一个新的微模块')
        .action((str, options) => {
            const baseModulePath = `${process.env.PWD}/src/modules/`
            const genConfig = (obj) => {
                const camelName = lodash.upperFirst(lodash.camelCase(obj.name))
                return {
                    ...obj,
                    camelName: camelName,
                    modulePath: baseModulePath + camelName
                }
            }
            if (options.args.length === 0) return createLib.init().then(res => {
                // 到这边已经验证过不存在输入的模块文件夹了
                createEvery(genConfig(res))
            })
            let input = options.args[0]
            let name = input
            let version = '1.0.0'
            if (input.includes('@')) {
                name = input.split('@')[0]
                version = input.split('@')[1]
            }
            existModule(name)
            createEvery(genConfig({
                name,
                version
            }))
        });
    program.parse();
}

parseCli()
