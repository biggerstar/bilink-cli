
export default function createHtml(res) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>BI-LINK micro-app</title>
</head>
<body>
<div id="app"></div>
<script type="module" src="./main.js"></script>
</body>
</html>
`
    // const matchScriptSrc = /<script.+src\s?=\s?"(.+)".+<\/script>/
    // const newModulePath = res.modulePath
    // const srcPath = `./main.js`  //相对于项目
    // const newHtml = templateHtml.replace(matchScriptSrc, `<script type="module" src="${srcPath}"></script>`)
    // console.log(newModulePath);
}
