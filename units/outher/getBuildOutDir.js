export default function (moduleInfo) {
  // 设置输出位置
  const moduleName = moduleInfo.name
  let typeOutDir = moduleInfo['typeOutDir']
  let outDir = `dist/${moduleInfo.moduleType}/${moduleName}/${moduleInfo.version}` //默认使用moduleType
  if (!typeOutDir) outDir = `dist/${moduleName}/${moduleInfo.version}`  //undefined，null,false,''等情况下输出到根目录
  if (typeOutDir && typeof typeOutDir === 'string') outDir = `dist/${typeOutDir}/${moduleName}/${moduleInfo.version}`//外部指定目录
  return outDir
}
