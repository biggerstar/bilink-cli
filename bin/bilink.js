#!/usr/bin/env node 
 var N=Object.defineProperty;var D=(t,e,n)=>e in t?N(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var f=(t,e,n)=>(D(t,typeof e!="symbol"?e+"":e,n),n);import{Command as P}from"commander";import u from"fs";import p from"path";import{fileURLToPath as L}from"url";import S from"lodash";import x from"glob";import{createRequire as A}from"module";import E from"fs-extra";import $ from"inquirer";const O="modulepreload",T=function(t){return"/"+t},k={},F=function(e,n,r){if(!n||n.length===0)return e();const l=document.getElementsByTagName("link");return Promise.all(n.map(o=>{if(o=T(o),o in k)return;k[o]=!0;const i=o.endsWith(".css"),a=i?'[rel="stylesheet"]':"";if(!!r)for(let h=l.length-1;h>=0;h--){const g=l[h];if(g.href===o&&(!i||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${a}`))return;const m=document.createElement("link");if(m.rel=i?"stylesheet":O,i||(m.as="script",m.crossOrigin=""),m.href=o,document.head.appendChild(m),i)return new Promise((h,g)=>{m.addEventListener("load",h),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>e())};function R(t){return A(import.meta.url)(t)}function w(t){if(u.existsSync(t))return!0;if(w(p.dirname(t)))return u.mkdirSync(t),!0}function j(t){const e=t.name;let n=t.typeOutDir,r=`dist/${t.moduleType}/${e}/${t.version}`;return n||(r=`dist/${e}/${t.version}`),n&&typeof n=="string"&&(r=`dist/${n}/${e}/${t.version}`),r}const I=t=>{const e=/<script.+src\s*=\s*["|']\s*(\.?\/.+)\s*["|'].+<\/script>/,n=/<link.+href\s*=\s*["|']\s*(\.?\/.+)\s*["|']>/;return t=t.replace(e,'<script src=".$1"><\/script>'),t=t.replace(n,'<link rel="stylesheet" href=".$1">'),t};function _(t){return{name:"moveIndexHtmlToRoot",closeBundle(){const e=t.outDir;console.log(e);const n=setInterval(()=>{const r=x.sync(`${e}/src/modules/**/index.html`);let l=r.length>0?r[0]:null;if(l){const o=u.readFileSync(l,"utf-8"),i=I(o);u.writeFileSync(e+"/index.html",i),E.remove(`${e}/src`),clearInterval(n)}},1e3)}}}function v(t,e){let n;for(n in e)t[n]=t[n]&&t[n].toString()==="[object Object]"&&e[n]&&e[n].toString()==="[object Object]"?v(t[n],e[n]):t[n]=e[n];return t}const{build:H,createServer:U,preview:V}=R("vite");var d;const s=(d=class{static allowBuild(e=[]){e===!0&&(e=[]),s.allowBuildList=e.map(n=>n.toLowerCase())}static async build(e=[]){d.allowBuild(e),await s.genModuleConfig();const n=Object.keys(s.allModuleConfig);e.length===0?e=n:e.forEach(r=>{if(!n.map(l=>l.toLowerCase()).includes(r.toLowerCase()))throw`不存在微模块: ${r},如果您定义了，请检查vite.js配置文件是否存在`}),console.log("➡ 当前编译的模块列表: ",e);for(let r=0;r<e.length;r++){const l=s.allModuleConfig[e[r].toLowerCase()];if(!l)throw`未找到微模块: ${e[r]}对应的配置信息`;const o=l.name||e[r];l.outDir=j(l);let i={mode:"production",plugins:[],build:{emptyOutDir:!0,outDir:l.outDir}};l.moduleType==="normal"&&(i=v(i,{build:{rollupOptions:{external:[],input:p.resolve(process.cwd(),`src/${s.moduleDir}/${o}/index.html`)}},lib:{entry:!1}})),l.moduleType==="library"&&(i=v(i,{build:{rollupOptions:{input:!1,external:["vue"]},lib:{entry:p.resolve(process.cwd(),`src/${s.moduleDir}/${o}/index.js`),name:o,formats:["es"],fileName:o}}})),i=v(i,l),l.moduleType==="normal"&&i.plugins.push(_(l));const a=console.log;console.log=(...c)=>{const m=c.length>0?c[0]:void 0;typeof m=="string"&&m.includes("vite")&&m.includes("building")?a("➕  开始编译模块\x1B[32m",o,"\x1B[0m"):a(...c)},await H(i),console.log=a}console.log("✅   build completed")}static async serve(e,n=!1,r={syncModuleConfig:!0,runServe:!0}){var g;const l=Date.now();if(r.syncModuleConfig!==!1&&await s.genModuleConfig(),r.runServe===!1)return;if(!e)throw new Error("未找到指定模块");const o=p.resolve(process.cwd(),`src/${s.moduleDir}/${e}/`);let i=s.allModuleConfig[e]||s.allModuleConfig[e.toLowerCase()];if(!i)throw"未找到模块"+e+"指定的vite配置信息";let a=v({server:{hmr:!0,host:"0.0.0.0"},root:o},i);((g=a==null?void 0:a.server)==null?void 0:g.https)===!0&&(a=v(a,{server:{https:{key:u.readFileSync(p.resolve(process.cwd(),"./keys/localhost+1-key.pem")),cert:u.readFileSync(p.resolve(process.cwd(),"./keys/localhost+1.pem"))}}}));let c={};n?c=await V(a):(c=await U(a),await c.listen());const h=Date.now()-l+" ms";console.clear(),console.log(`

     BI-LINK v${s.version} ready in ${h}
`),c.printUrls()}static async genModuleConfig(){const e=p.join(process.cwd(),`/src/${s.moduleDir}`);u.existsSync(e)||w(e);const n=u.readdirSync(e);s.allSourceModuleName=[];for(let r=0;r<n.length;r++){const l=n[r],o=`${e}/${l}`;if(s.allSourceModuleName.push(l),u.existsSync(o)){if(!u.readdirSync(o).includes("vite.js"))continue;const a=`${o}/vite.js`;s.allModuleConfig[l.toLowerCase()]=await(await F(()=>import(a),[])).default}}return s.allModuleConfig}static genReg(e=[]){return new RegExp(`.+\\.(${e.join("|")})$`)}static parseModuleName(e){const n=new RegExp(`src/${s.moduleDir}/([^/]+)/.+`),r=e.toString().match(n);return Array.isArray(r)?r[1]:null}static parseFileSuffix(e){return e.includes(".")?e.split(".").pop():null}static createBuildOutput(){return{}}static createBuildInput(){const e={};return x.sync(`${process.cwd()}/src/${s.moduleDir}/**/index.html`).forEach(r=>{const l=r.split("/"),o=l[l.length-2];(s.allowBuildList.includes(o.toLowerCase())||s.allowBuildList.length===0)&&(e[o]=`${process.cwd()}/src/${s.moduleDir}/${o}/index.html`)}),e}static async createVitePlugin({output:e=!0,input:n=!0}={}){return{name:s.name,async config(r,l){return(r.allowBuild===!0||Array.isArray(r.allowBuild))&&s.allowBuild(r.allowBuild),e&&await s.genModuleConfig(),{build:{rollupOptions:{input:n?s.createBuildInput():{},output:e?s.createBuildOutput():{}}},lib:{entry:"",formats:["es"]}}},transform(r,l){}}}static manualChunks(e,{getModuleIds:n,getModuleInfo:r}){const l=s.parseModuleName(e);if(l){const i=s.allModuleConfig[l.toLowerCase()].version,a=s.parseFileSuffix(e),c=s.genReg;if(c(["js","vue"]).test(e))return`${l}/${i}/index`;if(c(["css","html"]).test(e))return`${l}-%-${i}-%-index.${a}`}}static entryFileNames(e){return"base.[hash].js"}static chunkFileNames(e){return"[name].[hash].js"}static assetFileNames(e){return s.genReg(["css","html"]).test(e.name)&&e.name.includes("-%-")?e.name.replaceAll("-%-","/"):"[name].[hash].[ext]"}},f(d,"version","1.0.0"),f(d,"allowBuildList",[]),f(d,"allModuleConfig",{}),f(d,"allSourceModuleName",[]),f(d,"moduleDir","modules"),f(d,"name","autoBuild"),f(d,"isHookOutput",!1),d);function q(t){return`<!DOCTYPE html>
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
`}function J(){return`import {createApp} from 'vue'
import App from './App.vue'
const app = createApp(App)
app.mount('#app')`}function K(t){const e=t.moduleType==="normal"?`
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
}`}function z(t){const e=t.camelName;return`<template>
  <${e}/> 
</template>

<script setup>
import ${e} from './components/${e}.vue'
<\/script>

<style scoped>
div{
  background: #f5f5f5;    
}
</style>`}function W(t){return`<template>
  <div> Hello Bi-Link</div>
</template>

<script setup>
<\/script>

<style scoped>
</style>`}function Y(t){return`// 用于构建单组件库导出对应模块，同模块工程下可导出多个.vue组件供外部引入使用,该文件只会在library模式中被创建
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
`}function y(t,e){const n=t.split("/");n[n.length-1].includes(".")&&n.pop(),w(n.join("/")),u.existsSync(t)||u.writeFileSync(t,e)}function B(t={}){w(`${t.modulePath}/router`),y(`${t.modulePath}/index.html`,q()),y(`${t.modulePath}/main.js`,J()),y(`${t.modulePath}/vite.js`,K(t)),y(`${t.modulePath}/App.vue`,z(t)),w(`${t.modulePath}/components`),y(`${t.modulePath}/components/${t.camelName}.vue`,W()),t.moduleType==="library"&&y(`${t.modulePath}/index.js`,Y(t)),console.log("➕  \x1B[2m 模块位置",t.modulePath,"\x1B[0m")}const Z=t=>{const e=new RegExp("src/modules/(.+)/.?"),n=t.toString().match(e);return Array.isArray(n)?n[1]:null};function b(t){return x.sync(`${process.cwd()}/src/modules/?**/`).map(r=>Z(r).toLowerCase()).includes(t.toLowerCase())?(console.log("  => \x1B[41m \x1B[37m"+t+"  \x1B[0m  \x1B[33m微模块已经存在，请重新起名\x1B[0m"),!0):!1}const M={create(){let t=!0;return $.prompt([{message:"请输入要添加的模块名称: ",name:"name",filter:e=>((e.length<=0||b(e))&&(t=!1),e&&!/^[a-zA-Z_]/.test(e)&&(console.log(`
=> 模块名必须使用英文`),t=!1),t===!1&&(e=""),e),validate:()=>{const e=t;return t=!0,e}},{message:"请输入版本号: ",name:"version",default:"1.0.0"},{type:"list",message:"请选择开发组件类型:",name:"moduleType",choices:["normal: 普通vue项目(打包后提供html入口独立访问)","library: 组件库项目(打包后可被js直接导入组件使用)"],filter:e=>e.split(":")[0].trim()}])},buildAll(t){return $.prompt([{type:"list",message:"是否确定要编译所有微模块？",name:"allow",choices:["yes","no","select","handle"]},{type:"checkbox",message:`请选择要编译的微模块名称(多选):
 => `,name:"select",when:e=>e.allow==="select",choices:t,validate:e=>e.length>0},{type:"input",message:`请输入要编译的微模块名称，不同模块以空格隔开(ctrl + c退出):
 => `,name:"handle",when:e=>e.allow==="handle",filter:e=>e.trim().length===0?"":e,validate:e=>e.trim()!==""}])},serveChoices(t){return $.prompt([{type:"list",message:"选择要启动服务的微模块",name:"serveName",choices:t}])}};async function G(t,e){const n=`${process.cwd()}/src/modules/`,r=a=>{const c=S.upperFirst(S.camelCase(a.name));return{...a,camelName:c,modulePath:n+c}};if(e.args.length===0)return await M.create().then(a=>{B(r(a))});let l=e.args[0],o=l,i="1.0.0";l.includes("@")&&(o=l.split("@")[0],i=l.split("@")[1]),b(o),B(r({name:o,version:i,moduleType:"normal"}))}async function Q(t,e){let n=e.args;if(n.length===0){await s.genModuleConfig();const r=Object.keys(s.allModuleConfig);if(r.length===0)return console.log(" ❌  Modules is empty");const l=await M.buildAll(r);if(l.allow==="select")n=l.select;else if(l.allow==="handle")n=l.handle.split(/\s/).filter(o=>o!=="");else if(l.allow!=="yes")return console.log(" ❌  Compilation terminated")}await s.build(n)}async function C(t,e,n=!1){if(e.args.length>0)await s.serve(e.args[0],n);else{await s.serve(e.args[0],n,{syncModuleConfig:!0,runServe:!1});const r=s.allSourceModuleName;if(r.length===0)return console.log(" ❌  Modules is empty");await M.serveChoices(r).then(async l=>{await s.serve(l.serveName,n)})}}async function X(t,e){await C(t,e,!0)}function ee(){const t=L(import.meta.url),e=p.dirname(t);let n=null;try{n=JSON.parse(u.readFileSync(p.resolve(e,"./../package.json"),"utf8"))}catch{}const r=n?n.version:"1.0.0";s.version=r;const l=new P;l.name("bilink").description("用于创建一个新的微模块").version(r).action(async(o,i)=>{await C(o,i)}),l.command("create").alias("c").description("创建一个新的微模块").action(async(o,i)=>{await G(o,i)}),l.command("build").alias("b").description("编译指定微模块").action(async(o,i)=>{await Q(o,i)}),l.command("serve").alias("s").description("运行web服务器").action(async(o,i)=>{await C(o,i)}),l.command("preview").alias("p").description("构建产物预览").action(async(o,i)=>{await X(o,i)}),l.parse()}ee();
