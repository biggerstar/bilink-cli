import inquirer from "inquirer";
import existModule from "../outher/existModule.js";

const prompts = {
    create() {
        let isValidateDone = true
        return inquirer['prompt']([
            {
                message: '请输入要添加的模块名称: ', name: 'name', filter: (input) => {
                    if (input.length <= 0 || existModule(input)) isValidateDone = false
                    if (input && !(/^[a-zA-Z_]/.test(input))) {  /*首字母验证*/
                        console.log('\n=> 模块名必须使用英文');
                        isValidateDone = false
                    }
                    if (isValidateDone === false) input = ''
                    return input
                }, validate: () => {
                    const validateDone = isValidateDone
                    isValidateDone = true
                    return validateDone
                },
            },
            {
                message: '请输入版本号: ', name: 'version', default: '1.0.0'
            },
            {
                type: 'list',
                message: '请选择开发组件类型:',
                name: 'moduleType',
                choices: [
                    'normal: 普通vue项目(打包后提供html入口独立访问)',
                    'library: 组件库项目(打包后可被js直接导入组件使用)',
                ],
                filter: (input) => input.split(':')[0].trim()
            },
        ])
    },
    buildAll(allModuleName) {
        return inquirer['prompt'](
            [
                {
                    type: 'list',
                    message: '是否确定要编译所有微模块？',
                    name: 'allow',
                    choices: [
                        'yes',
                        'no',
                        'select',
                        'handle'
                    ],
                },
                {
                    type: "checkbox",
                    message: "请选择要编译的微模块名称(多选):\n => ",
                    name: "select",
                    when: (res) => res.allow === 'select',
                    choices: allModuleName,
                    validate: (input) => input.length > 0
                },
                {
                    type: "input",
                    message: "请输入要编译的微模块名称，不同模块以空格隔开(ctrl + c退出):\n => ",
                    name: "handle",
                    when: (res) => res.allow === 'handle',
                    filter: (input) => input.trim().length === 0 ? '' : input,
                    validate: (input) => input.trim() !== ''
                }
            ])
    },
    serveChoices(allModuleName) {
        return inquirer['prompt'](
            [
                {
                    type: 'list',
                    message: '选择要启动服务的微模块',
                    name: 'serveName',
                    choices: allModuleName,
                }
            ])
    }
}
export default prompts
