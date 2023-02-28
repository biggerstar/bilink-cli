#!/usr/bin/env node
import {Command} from 'commander'
import fs from "fs"
import path from "path"
import lodash from "lodash"
import AutoBuild from "../unitl/AutoBuild.js"
import createEvery from "../unitl/create/index.js";
import existModule from "../unitl/existModule.js";
import prompts from "../unitl/prompts/index.js";

async function biLinkCreate(str, options) {
    const baseModulePath = `${process.env.PWD}/src/modules/`
    const genConfig = (obj) => {
        const camelName = lodash.upperFirst(lodash.camelCase(obj.name))
        return {
            ...obj, camelName: camelName, modulePath: baseModulePath + camelName
        }
    }
    if (options.args.length === 0) return await prompts.create().then(res => {
        // 到这边已经在异步函数里验证过不存在重复的模块文件夹了
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
        name, version
    }))
}

async function biLinkBuild(str, options) {
    let buildAllow = options.args
    if (buildAllow.length === 0) {
        const res = await prompts.buildAll()
        if (res.allow === 'custom') buildAllow = res.custom.split(/\s/).filter(name => name !== '')
        else if (!(res.allow === 'yes')) return console.log(' ❌  Compilation terminated');
    }
    await AutoBuild.build(buildAllow)
}

async function biLinkServe(str, options, isPreview = false) {
    if (options.args.length > 0) {
        await AutoBuild.serve(options.args[0], isPreview)
    } else {
        await AutoBuild.serve(options.args[0], isPreview, {syncModuleConfig: true, runServe: false})  // 为了获得allModuleConfig
        const allModuleName = Object.keys(AutoBuild.allModuleConfig).map(name => name.toLowerCase())
        await prompts.serveChoices(allModuleName).then(async (res) => {
            await AutoBuild.serve(res['serveName'], isPreview)
        })
    }
}

async function biLinkPreview(str, options) {
    await biLinkServe(str, options, true)
}

function parseCli() {
    const packageConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'))
    const version = packageConfig ? packageConfig.version : '1.0.0'  // 无伤大雅，不严谨懒得整
    const program = new Command();
    program
        .name('bilink')
        .description('用于创建一个新的微模块')
        .version(version)
        .action(async (str, options) => {
            await biLinkServe(str, options)
        })
    program.command('create')
        .alias('c')
        .description('创建一个新的微模块')
        .action(async (str, options) => {
            await biLinkCreate(str, options)
        });
    program.command('build')
        .alias('b')
        .description('编译指定微模块')
        .action(async (str, options) => {
            await biLinkBuild(str, options)
        });
    program.command('serve')
        .alias('s')
        .description('运行web服务器')
        .action(async (str, options) => {
            await biLinkServe(str, options)
        });
    program.command('preview')
        .alias('p')
        .description('构建产物预览')
        .action(async (str, options) => {
            await biLinkPreview(str, options)
        });
    program.parse();
}

parseCli()
