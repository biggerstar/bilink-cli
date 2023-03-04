#!/usr/bin/env node 
 var D=Object.defineProperty;var P=(t,e,n)=>e in t?D(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var f=(t,e,n)=>(P(t,typeof e!="symbol"?e+"":e,n),n);import{Command as L}from"commander";import u from"fs";import p from"path";import{fileURLToPath as A}from"url";import k from"lodash";import M from"glob";import{createRequire as E}from"module";import O from"fs-extra";import $ from"inquirer";const T=A(import.meta.url),C=p.dirname(T),F="modulepreload",R=function(t){return"/"+t},B={},j=function(e,n,l){if(!n||n.length===0)return e();const r=document.getElementsByTagName("link");return Promise.all(n.map(s=>{if(s=R(s),s in B)return;B[s]=!0;const i=s.endsWith(".css"),a=i?'[rel="stylesheet"]':"";if(!!l)for(let h=r.length-1;h>=0;h--){const g=r[h];if(g.href===s&&(!i||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${a}`))return;const m=document.createElement("link");if(m.rel=i?"stylesheet":F,i||(m.as="script",m.crossOrigin=""),m.href=s,document.head.appendChild(m),i)return new Promise((h,g)=>{m.addEventListener("load",h),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e())};function I(t){return E(import.meta.url)(t)}function w(t){if(u.existsSync(t))return!0;if(w(p.dirname(t)))return u.mkdirSync(t),!0}function _(t){const e=t.name;let n=t.typeOutDir,l=`dist/${t.moduleType}/${e}/${t.version}`;return n||(l=`dist/${e}/${t.version}`),n&&typeof n=="string"&&(l=`dist/${n}/${e}/${t.version}`),l}const H=t=>{const e=/<script.+src\s*=\s*["|']\s*(\.?\/.+)\s*["|'].+<\/script>/,n=/<link.+href\s*=\s*["|']\s*(\.?\/.+)\s*["|']>/;return t=t.replace(e,'<script src=".$1"><\/script>'),t=t.replace(n,'<link rel="stylesheet" href=".$1">'),t};function U(t){return{name:"moveIndexHtmlToRoot",closeBundle(){const e=t.outDir;console.log(e);const n=setInterval(()=>{const l=M.sync(`${e}/src/modules/**/index.html`);let r=l.length>0?l[0]:null;if(r){const s=u.readFileSync(r,"utf-8"),i=H(s);u.writeFileSync(e+"/index.html",i),O.remove(`${e}/src`),clearInterval(n)}},1e3)}}}function v(t,e){let n;for(n in e)t[n]=t[n]&&t[n].toString()==="[object Object]"&&e[n]&&e[n].toString()==="[object Object]"?v(t[n],e[n]):t[n]=e[n];return t}const{build:V,createServer:q,preview:J}=I("vite");var d;const o=(d=class{static allowBuild(e=[]){e===!0&&(e=[]),o.allowBuildList=e.map(n=>n.toLowerCase())}static async build(e=[]){d.allowBuild(e),await o.genModuleConfig();const n=Object.keys(o.allModuleConfig);e.length===0?e=n:e.forEach(l=>{if(!n.map(r=>r.toLowerCase()).includes(l.toLowerCase()))throw`不存在微模块: ${l},如果您定义了，请检查vite.js配置文件是否存在`}),console.log("➡ 当前编译的模块列表: ",e);for(let l=0;l<e.length;l++){const r=o.allModuleConfig[e[l].toLowerCase()];if(!r)throw`未找到微模块: ${e[l]}对应的配置信息`;const s=r.name||e[l];r.outDir=_(r);let i={mode:"production",plugins:[],build:{emptyOutDir:!0,outDir:r.outDir}};r.moduleType==="normal"&&(i=v(i,{build:{rollupOptions:{external:[],input:p.resolve(process.cwd(),`src/${o.moduleDir}/${s}/index.html`)}},lib:{entry:!1}})),r.moduleType==="library"&&(i=v(i,{build:{rollupOptions:{input:!1,external:["vue"]},lib:{entry:p.resolve(process.cwd(),`src/${o.moduleDir}/${s}/index.js`),name:s,formats:["es"],fileName:s}}})),i=v(i,r),r.moduleType==="normal"&&i.plugins.push(U(r));const a=console.log;console.log=(...c)=>{const m=c.length>0?c[0]:void 0;typeof m=="string"&&m.includes("vite")&&m.includes("building")?a("➕  开始编译模块\x1B[32m",s,"\x1B[0m"):a(...c)},await V(i),console.log=a}console.log("✅   build completed")}static async serve(e,n=!1,l={syncModuleConfig:!0,runServe:!0}){var g;const r=Date.now();if(l.syncModuleConfig!==!1&&await o.genModuleConfig(),l.runServe===!1)return;if(!e)throw new Error("未找到指定模块");const s=p.resolve(process.cwd(),`src/${o.moduleDir}/${e}/`);let i=o.allModuleConfig[e]||o.allModuleConfig[e.toLowerCase()];if(!i)throw"未找到模块"+e+"指定的vite配置信息";let a=v({server:{hmr:!0,host:"0.0.0.0"},root:s},i);((g=a==null?void 0:a.server)==null?void 0:g.https)===!0&&(a=v(a,{server:{https:{key:u.readFileSync(p.resolve(C,"./keys/localhost+1-key.pem")),cert:u.readFileSync(p.resolve(C,"./keys/localhost+1.pem"))}}}));let c={};n?c=await J(a):(c=await q(a),await c.listen());const h=Date.now()-r+" ms";console.clear(),console.log(`

     BI-LINK v${o.version} ready in ${h}
`),c.printUrls()}static async genModuleConfig(){const e=p.join(process.cwd(),`/src/${o.moduleDir}`);u.existsSync(e)||w(e);const n=u.readdirSync(e);o.allSourceModuleName=[];for(let l=0;l<n.length;l++){const r=n[l],s=`${e}/${r}`;if(o.allSourceModuleName.push(r),u.existsSync(s)){if(!u.readdirSync(s).includes("vite.js"))continue;const a=`${s}/vite.js`;o.allModuleConfig[r.toLowerCase()]=await(await j(()=>import(a),[])).default}}return o.allModuleConfig}static genReg(e=[]){return new RegExp(`.+\\.(${e.join("|")})$`)}static parseModuleName(e){const n=new RegExp(`src/${o.moduleDir}/([^/]+)/.+`),l=e.toString().match(n);return Array.isArray(l)?l[1]:null}static parseFileSuffix(e){return e.includes(".")?e.split(".").pop():null}static createBuildOutput(){return{}}static createBuildInput(){const e={};return M.sync(`${process.cwd()}/src/${o.moduleDir}/**/index.html`).forEach(l=>{const r=l.split("/"),s=r[r.length-2];(o.allowBuildList.includes(s.toLowerCase())||o.allowBuildList.length===0)&&(e[s]=`${process.cwd()}/src/${o.moduleDir}/${s}/index.html`)}),e}static async createVitePlugin({output:e=!0,input:n=!0}={}){return{name:o.name,async config(l,r){return(l.allowBuild===!0||Array.isArray(l.allowBuild))&&o.allowBuild(l.allowBuild),e&&await o.genModuleConfig(),{build:{rollupOptions:{input:n?o.createBuildInput():{},output:e?o.createBuildOutput():{}}},lib:{entry:"",formats:["es"]}}},transform(l,r){}}}static manualChunks(e,{getModuleIds:n,getModuleInfo:l}){const r=o.parseModuleName(e);if(r){const i=o.allModuleConfig[r.toLowerCase()].version,a=o.parseFileSuffix(e),c=o.genReg;if(c(["js","vue"]).test(e))return`${r}/${i}/index`;if(c(["css","html"]).test(e))return`${r}-%-${i}-%-index.${a}`}}static entryFileNames(e){return"base.[hash].js"}static chunkFileNames(e){return"[name].[hash].js"}static assetFileNames(e){return o.genReg(["css","html"]).test(e.name)&&e.name.includes("-%-")?e.name.replaceAll("-%-","/"):"[name].[hash].[ext]"}},f(d,"version","1.0.0"),f(d,"allowBuildList",[]),f(d,"allModuleConfig",{}),f(d,"allSourceModuleName",[]),f(d,"moduleDir","modules"),f(d,"name","autoBuild"),f(d,"isHookOutput",!1),d);function K(t){return`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>BI-LINK micro-app</title>
</head>
<body>
<div id="app"></div>
<script type="module" src="./main.js"><\/script>
</body>
</html>
`}function z(){return`import {createApp} from 'vue'
import App from './App.vue'
const app = createApp(App)
app.mount('#app')`}function W(t){const e=t.moduleType==="normal"?`
    /* 普通开发模式下，可以在input中修改打包入口 */
    //input : path.resolve(process.cwd(),'src/modules/${t.camelName}/index.html'),`:"";return`import vue from '@vitejs/plugin-vue'
import path from "path";

/* 该配置和vite.config.js配置完全一致，并且该配置只适用于同目录下的微模块，模块间互不影响 */
export default {
  name: "${t.camelName}",
  version: "${t.version}",
  moduleType: "${t.moduleType}",
  typeOutDir: "${t.moduleType}", // 默认编译输出分类文件夹
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    }
  },
  build: {
    rollupOptions: { ${e}
      external: ['vue'],   // 如果只打包单组件无需打包第三方库，则在这里将其排除不进行打包
    }
  },
  server: {
    host: '0.0.0.0',
    https:true, // 内置了证书可以直接使用https
  },
}`}function Y(t){const e=t.camelName;return`<template>
  <${e}/> 
</template>

<script setup>
import ${e} from './components/${e}.vue'
<\/script>

<style scoped>
div{
  background: #f5f5f5;    
}
</style>`}function Z(t){return`<template>
  <div> Hello Bi-Link</div>
</template>

<script setup>
<\/script>

<style scoped>
</style>`}function G(t){return`// 用于构建单组件库导出对应模块，同模块工程下可导出多个.vue组件供外部引入使用,该文件只会在library模式中被创建
import ${t.camelName} from './components/${t.camelName}.vue'

const components = {
    ${t.camelName},
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
`}function y(t,e){const n=t.split("/");n[n.length-1].includes(".")&&n.pop(),w(n.join("/")),u.existsSync(t)||u.writeFileSync(t,e)}function b(t={}){w(`${t.modulePath}/router`),y(`${t.modulePath}/index.html`,K()),y(`${t.modulePath}/main.js`,z()),y(`${t.modulePath}/vite.js`,W(t)),y(`${t.modulePath}/App.vue`,Y(t)),w(`${t.modulePath}/components`),y(`${t.modulePath}/components/${t.camelName}.vue`,Z()),t.moduleType==="library"&&y(`${t.modulePath}/index.js`,G(t)),console.log("➕  \x1B[2m 模块位置",t.modulePath,"\x1B[0m")}const Q=t=>{const e=new RegExp("src/modules/(.+)/.?"),n=t.toString().match(e);return Array.isArray(n)?n[1]:null};function N(t){return M.sync(`${process.cwd()}/src/modules/?**/`).map(l=>Q(l).toLowerCase()).includes(t.toLowerCase())?(console.log("  => \x1B[41m \x1B[37m"+t+"  \x1B[0m  \x1B[33m微模块已经存在，请重新起名\x1B[0m"),!0):!1}const S={create(){let t=!0;return $.prompt([{message:"请输入要添加的模块名称: ",name:"name",filter:e=>((e.length<=0||N(e))&&(t=!1),e&&!/^[a-zA-Z_]/.test(e)&&(console.log(`
=> 模块名必须使用英文`),t=!1),t===!1&&(e=""),e),validate:()=>{const e=t;return t=!0,e}},{message:"请输入版本号: ",name:"version",default:"1.0.0"},{type:"list",message:"请选择开发组件类型:",name:"moduleType",choices:["normal: 普通vue项目(打包后提供html入口独立访问)","library: 组件库项目(打包后可被js直接导入组件使用)"],filter:e=>e.split(":")[0].trim()}])},buildAll(t){return $.prompt([{type:"list",message:"是否确定要编译所有微模块？",name:"allow",choices:["yes","no","select","handle"]},{type:"checkbox",message:`请选择要编译的微模块名称(多选):
 => `,name:"select",when:e=>e.allow==="select",choices:t,validate:e=>e.length>0},{type:"input",message:`请输入要编译的微模块名称，不同模块以空格隔开(ctrl + c退出):
 => `,name:"handle",when:e=>e.allow==="handle",filter:e=>e.trim().length===0?"":e,validate:e=>e.trim()!==""}])},serveChoices(t){return $.prompt([{type:"list",message:"选择要启动服务的微模块",name:"serveName",choices:t}])}};async function X(t,e){const n=`${process.cwd()}/src/modules/`,l=a=>{const c=k.upperFirst(k.camelCase(a.name));return{...a,camelName:c,modulePath:n+c}};if(e.args.length===0)return await S.create().then(a=>{b(l(a))});let r=e.args[0],s=r,i="1.0.0";r.includes("@")&&(s=r.split("@")[0],i=r.split("@")[1]),N(s),b(l({name:s,version:i,moduleType:"normal"}))}async function ee(t,e){let n=e.args;if(n.length===0){await o.genModuleConfig();const l=Object.keys(o.allModuleConfig);if(l.length===0)return console.log(" ❌  Modules is empty");const r=await S.buildAll(l);if(r.allow==="select")n=r.select;else if(r.allow==="handle")n=r.handle.split(/\s/).filter(s=>s!=="");else if(r.allow!=="yes")return console.log(" ❌  Compilation terminated")}await o.build(n)}async function x(t,e,n=!1){if(e.args.length>0)await o.serve(e.args[0],n);else{await o.serve(e.args[0],n,{syncModuleConfig:!0,runServe:!1});const l=o.allSourceModuleName;if(l.length===0)return console.log(" ❌  Modules is empty");await S.serveChoices(l).then(async r=>{await o.serve(r.serveName,n)})}}async function te(t,e){await x(t,e,!0)}function ne(){let t=null;try{t=JSON.parse(u.readFileSync(p.resolve(C,"./../package.json"),"utf8"))}catch{}const e=t?t.version:"1.0.0";o.version=e;const n=new L;n.name("bilink").description("用于创建一个新的微模块").version(e).action(async(l,r)=>{await x(l,r)}),n.command("create").alias("c").description("创建一个新的微模块").action(async(l,r)=>{await X(l,r)}),n.command("build").alias("b").description("编译指定微模块").action(async(l,r)=>{await ee(l,r)}),n.command("serve").alias("s").description("运行web服务器").action(async(l,r)=>{await x(l,r)}),n.command("preview").alias("p").description("构建产物预览").action(async(l,r)=>{await te(l,r)}),n.parse()}ne();
