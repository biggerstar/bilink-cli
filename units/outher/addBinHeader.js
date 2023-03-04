import path from "path";
import fs from "fs";
// 编译后为bin命令行脚本添加脚本头
const timer = setInterval(() => {
    // 添加脚本标识
    const header = '#!/usr/bin/env node'
    const sPath = path.resolve(process.cwd(), './bin/bilink.js')
    if (!fs.existsSync(sPath)) return
    let resData = fs.readFileSync(sPath).toString()
    if (resData.slice(0, 20).includes(header)) return
    const data = `${header} \n ${resData}`
    fs.writeFileSync(sPath, data, 'utf-8')
    clearInterval(timer)
}, 1000)
