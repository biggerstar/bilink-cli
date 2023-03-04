import glob from "glob";
import fse from "fs-extra";
import fs from "fs";
import getBuildOutDir from "../getBuildOutDir.js";

const replaceHtmlUrl = (code) => {
  const scriptReg = /<script.+src\s*=\s*["|']\s*(\.?\/.+)\s*["|'].+<\/script>/
  const cssReg = /<link.+href\s*=\s*["|']\s*(\.?\/.+)\s*["|']>/
  code = code.replace(scriptReg, '<script src=".$1"></script>')
  code = code.replace(cssReg, '<link rel="stylesheet" href=".$1">')
  return code
}


/**  手动移动index.html到指定模块编译产物根位置 */
export default function moveIndexHtmlToRootPlugin(moduleInfo) {
  return {
    name: 'moveIndexHtmlToRoot',
    closeBundle() {
      const outDir = moduleInfo.outDir
      console.log(outDir);
      const timer = setInterval(() => {
        const filesPath = glob.sync(`${outDir}/src/modules/**/index.html`)
        let indexFilePath = filesPath.length > 0 ? filesPath[0] : null
        if (indexFilePath) {
          const htmlContent = fs.readFileSync(indexFilePath, 'utf-8')
          const res = replaceHtmlUrl(htmlContent)
          fs.writeFileSync(outDir + '/index.html', res)
          fse.remove(`${outDir}/src`)
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
