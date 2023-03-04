import fs from 'fs';
import path from "path";
import glob from "glob";
import requireCjs from "./require.js";
import mkdirRecursive from "./mkdirRecursive.js";
import moveIndexHtmlToRootPlugin from './plugins/moveIndexHtmlToRoot.js'
import getBuildOutDir from "./getBuildOutDir.js";

const {build, createServer, preview} = requireCjs("vite")
import deepMerge from "./deepMerge.js";
// import basicSsl from '@vitejs/plugin-basic-ssl'

const self = class BiLink {
  static version = '1.0.0'
  static allowBuildList = []
  static allModuleConfig = {}   // key会全部被转成小写
  static allSourceModuleName = []   // 所有模块路径提取的模块目录原始名称
  static moduleDir = 'modules'
  static name = 'autoBuild'
  static isHookOutput = false

  /**
   * @param {Array} allowBuild  设置被允许编译的模块名数组
   * */
  static allowBuild(allowBuild = []) {
    // console.log(allowBuild)
    if (allowBuild === true) allowBuild = []
    self.allowBuildList = allowBuild.map(name => name.toLowerCase())
  }

  /** 执行编译，多次vite入口编译，基础路径为项目环境中 'src/modules/**' 下的对应模块，
   *  这些模块必须包含一个main.js文件作为打包入口
   * @param {Array} buildList 要编译的模块列表,如果传入为空或空数组则表示编译全部模块
   * */
  static async build(buildList = []) {
    BiLink.allowBuild(buildList)
    await self.genModuleConfig()
    const allModuleNameList /* 原名包含大小写的所有模块列表 */ = Object.keys(self.allModuleConfig)
    if (buildList.length === 0) buildList = allModuleNameList  // 为空则全部编译
    else {
      buildList.forEach(moduleName => {
        if (!allModuleNameList.map(name => name.toLowerCase())
          .includes(moduleName.toLowerCase())) throw `不存在微模块: ${moduleName},如果您定义了，请检查vite.js配置文件是否存在` // 用户自定义编译的模块验证
      })
    }
    console.log('\u27A1 当前编译的模块列表: ', buildList);
    for (let i = 0; i < buildList.length; i++) {
      const moduleInfo = self.allModuleConfig[buildList[i].toLowerCase()]
      if (!moduleInfo) throw `未找到微模块: ${buildList[i]}对应的配置信息`
      const moduleName = moduleInfo.name || buildList[i]
      moduleInfo.outDir = getBuildOutDir(moduleInfo)
      /* 开始生成初始的vite配置 */
      let buildConfig = {  /* 基本配置 */
        mode: 'production',
        plugins: [],
        build: {
          emptyOutDir: true,
          outDir: moduleInfo.outDir,
        },
      }
      if (moduleInfo.moduleType === 'normal') {  /* 普通打包模式 */
        // 有指定rollupOptions.input lib会被忽略
        buildConfig = deepMerge(buildConfig, {
          build: {
            rollupOptions: {
              external: [],
              input: path.resolve(process.cwd(), `src/${self.moduleDir}/${moduleName}/index.html`)
            }
          },
          lib: {
            entry: false
          }
        })
      }
      if (moduleInfo.moduleType === 'library') {  /* 组件库打包模式 */
        buildConfig = deepMerge(buildConfig, {
          build: {
            rollupOptions: {
              input: false,
              external: ['vue'],
            },
            lib: {
              entry: path.resolve(process.cwd(), `src/${self.moduleDir}/${moduleName}/index.js`),
              name: moduleName,
              formats: ['es'],/* formats 必须是数组,不然外部没开lib会报[].map not a function错误 */
              fileName: moduleName,
            }
          }
        })
        // console.log(buildConfig);
      }
      buildConfig /* 最终合并外部微模块专属的vite配置 */ = deepMerge(buildConfig, moduleInfo)

      /* 下面是拿到终配置的逻辑  */
      if (moduleInfo.moduleType === 'normal') {
        //  添加处理normal下html位置的插件
        // console.log(buildConfig);
        buildConfig.plugins.push(moveIndexHtmlToRootPlugin(moduleInfo))
      }
      // console.log(buildConfig);
      const sourceLog = console.log
      console.log = (...args) => {  /* 拦截控制台输出内容，并在后面归还*/  /* u2795 */
        const log = args.length > 0 ? args[0] : undefined
        if (typeof log === 'string' && log.includes('vite') && log.includes('building')) sourceLog('\u2795  开始编译模块\x1B[32m', moduleName, '\x1B[0m')
        else sourceLog(...args)
      }
      await build(buildConfig)
      console.log = sourceLog
    }
    console.log(`\u2705   build completed`); /* u2705*/
  }

  /** 对象形参不严谨，先这样吧
   * @param {String} moduleName  要启动服务器的对应微模块名称
   * @param {Boolean} isPreview  是否是预览模式
   * @param {Object} option
   * @param {Boolean} [option.syncModuleConfig = true]  是否进行IO操作同步最新存在的模块到本类的数据当中
   * @param {Boolean} [option.runServe = true]  是否启动服务器
   * */
  static async serve(moduleName, isPreview = false, option = {syncModuleConfig: true, runServe: true}) {
    const serverBegin = Date.now()
    if (option.syncModuleConfig !== false) await self.genModuleConfig()
    if (option.runServe === false) return
    if (!moduleName) throw new Error('未找到指定模块')
    const baseSrc = path.resolve(process.cwd(), `src/${self.moduleDir}/${moduleName}/`)
    let customViteConfig = self.allModuleConfig[moduleName] || self.allModuleConfig[moduleName.toLowerCase()]
    if (!customViteConfig) throw '未找到模块' + moduleName + '指定的vite配置信息'

    let viteConfig = deepMerge({
      server: {
        hmr: true,
        host: '0.0.0.0',
      },
      // envFile:true,
      root: baseSrc,  /* 要实现热更新必须moduleName和实例模块目录名一致,！！否则热更新不会生效 */
    }, customViteConfig)
    // console.log(viteConfig);
    if (viteConfig?.server?.https === true) {   //  自动添加本地证书进行https的加密
      viteConfig = deepMerge(viteConfig, {
        server: {
          https: {
            key: fs.readFileSync(path.resolve(process.cwd(), './keys/localhost+1-key.pem')),
            cert: fs.readFileSync(path.resolve(process.cwd(), './keys/localhost+1.pem'))
          },
        }
      })
    }
    /*  添加插件  */
    // viteConfig.plugins.push(preact())  //热更新
    // viteConfig.plugins.push(basicSsl())  //自动生成ssl证书

    // console.log(viteConfig);
    let server = {}
    if (isPreview) /* preview */ server = await preview(viteConfig)
    else {
      /* serve */
      server = await createServer(viteConfig)
      await server.listen()
    }
    // console.log(server.config);
    const serverEnd = Date.now();
    const serveTime = (serverEnd - serverBegin) + " ms"
    console.clear()
    console.log(`\n\n     BI-LINK v${self.version} ready in ${serveTime}\n`)
    server.printUrls()
    // console.log(server.config);
  }

  /** 获取所有的模块配置信息，包括:模块路径, build.json等 */
  static async genModuleConfig() {  // 后面如果对取路径过程的变量不敏感，可以通过glob优化下
    const baseModulePath = path.join(process.cwd(), `/src/${self.moduleDir}`)
    if (!fs.existsSync(baseModulePath)) mkdirRecursive(baseModulePath)
    const moduleDirs = fs.readdirSync(baseModulePath)  // component下的所有模块
    self.allSourceModuleName = []
    for (let i = 0; i < moduleDirs.length; i++) {
      const moduleName = moduleDirs[i]
      const modulePath = `${baseModulePath}/${moduleName}`  // 模块真实的根路径
      self.allSourceModuleName.push(moduleName)
      if (fs.existsSync(modulePath)) {    // 是否存在该模块文件夹
        const moduleFiles = fs.readdirSync(modulePath)
        if (!moduleFiles.includes(`vite.js`)) continue  // 不是一个模块直接忽略
        const buildFilePath = `${modulePath}/vite.js`
        self.allModuleConfig[moduleName.toLowerCase()] = await (await import(buildFilePath)).default // 拿到各个模块的vite.config.js配置
      }
    }
    return self.allModuleConfig

    // else throw '请检查模块存放目录src/modules是否位置正确,' +
    //     '可以通过字段AutoBuild.moduleDir重新指定src目录下任意文件夹为存放模块的主文件夹'
  }

  /** 生成能匹配指定后缀的正则表达式
   * @param {Array} matchList  要匹配的后缀列表
   * @return {RegExp} 返回能匹配指定后缀的正则表达式
   * */
  static genReg(matchList = []) {
    return new RegExp(`.+\\.(${matchList.join('|')})$`)
  }

  /** 通过文件路径解析当前微应用模块名 */
  static parseModuleName(filePath) {
    const reg = new RegExp(`src\/${self.moduleDir}\/([^\/]+)\/.+`)
    const componentMatch = filePath.toString().match(reg)
    if (Array.isArray(componentMatch)) { /* 对组件进行分包 */
      return componentMatch[1]
    }
    return null
  }

  /** 解析文件路径后缀
   * @param {String} filePath 文件路径
   * */
  static parseFileSuffix(filePath) {
    if (filePath.includes('.')) return filePath.split('.').pop()
    return null
  }

  static createBuildOutput() {
    if (!self.isHookOutput) return {}   // 默认不开启
    return {
      manualChunks: self.manualChunks,
      entryFileNames: self.entryFileNames,
      chunkFileNames: self.chunkFileNames,
      assetFileNames: self.assetFileNames,
    }
  }

  /**  创建多入口打包 */
  static createBuildInput() {
    const pageEntry = {};
    const allEntry = glob.sync(`${process.cwd()}/src/${self.moduleDir}/**/index.html`);
    allEntry.forEach((entry) => {
      const pathArr = entry.split("/");
      const name = pathArr[pathArr.length - 2];
      /* 如果存在允许导出列表，则将其导出 */
      if (self.allowBuildList.includes(name.toLowerCase())
        || self.allowBuildList.length === 0) {
        pageEntry[name] = `${process.cwd()}/src/${self.moduleDir}/${name}/index.html`
      }
    })
    return pageEntry
  }

  static async createVitePlugin({output = true, input = true} = {}) {
    return {
      name: self.name,
      async config(config, env) {
        if (config.allowBuild === true || Array.isArray(config.allowBuild)) self.allowBuild(config.allowBuild)
        if (output) await self.genModuleConfig()
        return {
          build: {
            rollupOptions: {
              input: input ? self.createBuildInput() : {},
              output: output ? self.createBuildOutput() : {}
            }
          },
          lib: {
            entry: '',
            formats: ['es'],
          },
        }
      },
      /** 代码字符串重构，形参code传入和返回输出同时支持js和css，如果不符合某规则返回空表示不打包导出 */
      transform(code, filePath) {
      }
    }
  }

  /** 处理所有被加载资源的代码分割并返回该代码打包到指定文件，不反回默认由entryFileNames函数处理 */
  static manualChunks(id, {getModuleIds, getModuleInfo}) {
    const moduleName = self.parseModuleName(id)
    if (moduleName) { /* 对找到的模块进行分包 */
      const moduleInfo = self.allModuleConfig[moduleName.toLowerCase()]
      const version = moduleInfo.version
      const fileSuffix = self.parseFileSuffix(id) // 文件后缀名
      const genReg = self.genReg
      // console.log(id);
      if (genReg(['js', 'vue']).test(id)) return `${moduleName}/${version}/index`
      if (genReg(['css', 'html']).test(id)) {
        // console.log(`${moduleName}-%-${version}-%-index.${fileSuffix}`);
        return `${moduleName}-%-${version}-%-index.${fileSuffix}`
        // return `${moduleName}/${version}/index.${fileSuffix}`
      }
    }
  }

  /** 单入口或多入口进入代码 */
  static entryFileNames(chunk) {
    // console.log(chunk);
    return 'base.[hash].js'
  }

  /** 处理manualChunks函数对应代码拆分时共享块的输出,执行在该函数之后可以HOOK改名*/
  static chunkFileNames(chunks) {
    // console.log(chunks);
    return `[name].[hash].js`
  }

  /** 处理manualChunks函数分割静态资源，执行在该函数之后HOOK*/
  static assetFileNames(asset) {
    // console.log(asset);
    if (self.genReg(['css', 'html']).test(asset.name) && asset.name.includes('-%-')) return asset.name.replaceAll('-%-', '/')
    return '[name].[hash].[ext]'
  }

}
export default self
