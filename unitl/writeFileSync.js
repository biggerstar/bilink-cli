import fs from "fs";
import mkdirRecursive from "./mkdirRecursive.js";

/** 同步写入数据
 * @param {String} path 要写入的文件绝对路径
 * @param {String} data 要写入的数据
 * */
export default function writeFileSync(path, data) {
    const pathHiera = path.split('/')
    if (pathHiera[pathHiera.length - 1].includes('.')) pathHiera.pop()
    mkdirRecursive(pathHiera.join('/'))
    if (!fs.existsSync(path)) fs.writeFileSync(path, data)
}
