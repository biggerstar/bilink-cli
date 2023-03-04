#!/usr/bin/env node
import {Command} from 'commander'
import fs from "fs"
import path from "path"
import {fileURLToPath} from 'url';

import lodash from "lodash"
import BiLink from "../BiLink.js"
import createEvery from "../create/index.js";
import existModule from "../existModule.js";
import prompts from "../prompts/index.js";

async function biLinkCreate(str, options) {
  const baseModulePath = `${process.cwd()}/src/modules/`
  const genConfig = (obj) => {
    const camelName = lodash.upperFirst(lodash.camelCase(obj.name))
    return {
      ...obj, camelName: camelName, modulePath: baseModulePath + camelName
    }
  }
  if (options.args.length === 0) return await prompts.create().then(res => {
    // 到这边已经在异步函数里验证过不存在重复的模块文件夹了
    // console.log(res);
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
    name, version,
    moduleType: 'normal'
  }))
}

async function biLinkBuild(str, options) {
  let buildAllow = options.args
  if (buildAllow.length === 0) { /* args中未传入编译模块名 */
    await BiLink.genModuleConfig()
    const allModuleName = Object.keys(BiLink.allModuleConfig)
    if (allModuleName.length === 0) return console.log(' \u274C  Modules is empty');
    const res = await prompts.buildAll(allModuleName)
    if (res.allow === 'select') buildAllow = res.select
    else if (res.allow === 'handle') buildAllow = res.handle.split(/\s/).filter(name => name !== '')
    else if (!(res.allow === 'yes')) return console.log(' \u274C  Compilation terminated'); // ❌
  }
  await BiLink.build(buildAllow)
}

async function biLinkServe(str, options, isPreview = false) {
  if (options.args.length > 0) {
    await BiLink.serve(options.args[0], isPreview)
  } else {
    await BiLink.serve(options.args[0], isPreview, {syncModuleConfig: true, runServe: false})  // 为了获得allModuleConfig
    const allModuleName = BiLink.allSourceModuleName
    if (allModuleName.length === 0) return console.log(' \u274C  Modules is empty'); // ❌
    await prompts.serveChoices(allModuleName).then(async (res) => {
      await BiLink.serve(res['serveName'], isPreview)
    })
  }
}

async function biLinkPreview(str, options) {
  await biLinkServe(str, options, true)
}


function parseCli() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  let packageConfig = null
  try {
    packageConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../package.json'), 'utf8'))
  } catch (e) {
  }
  const version = packageConfig ? packageConfig.version : '1.0.0'  // 无伤大雅，不严谨懒得整
  BiLink.version = version
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
