import fs from "fs";
import path from "path";

/** 创建单向连续文件夹
 * @param {String} dirname 文件夹路径
 * */
export default function mkdirRecursive(dirname) {
    if (fs.existsSync(dirname)) return true
    if (mkdirRecursive(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
    }
}
