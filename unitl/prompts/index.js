import inquirer from "inquirer";
import existModule from "../existModule.js";

const prompts = {
    create() {
        let isValidateDone = true
        return inquirer['prompt']([{
            message: '请输入要添加的模块名称: ', name: 'name', filter: (input) => {
                if (input.length <= 0 || existModule(input)) isValidateDone = false
                if (isValidateDone === false) input = ''
                return input
            }, validate: () => {
                const validateDone = isValidateDone
                isValidateDone = true
                return validateDone
            },
        }, {
            message: '请输入版本号: ', name: 'version', default: '1.0.0'
        },])
    },
    buildAll() {
        return inquirer['prompt'](
            [
                {
                    type: 'list',
                    message: '是否确定要编译所有微模块？',
                    name: 'allow',
                    choices: [
                        'yes',
                        'no',
                        'custom'
                    ],
                },
                {
                    type: "input",
                    message: "请输入要编译的微模块名称，不同模块以空格隔开(ctrl + c退出):\n => ",
                    name: "custom",
                    when: (res) => res.allow === 'custom',
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
                    message: '选择要启动的微模块',
                    name: 'serveName',
                    choices: allModuleName,
                }
            ])
    }
}
export default prompts
