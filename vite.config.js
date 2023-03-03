import path from "path";
import {defineConfig} from "vite";

export default defineConfig(({mode,command}) => {
    const config = {
        mode: 'development',
    }
    if (command === 'build') {
        config.build = {
            outDir: 'bin',
            minify: true,
            rollupOptions: {
                input: path.resolve(process.cwd(), `units/bin/bilink.js`),
                output: {
                    entryFileNames: '[name].js',
                    globals: {
                        fs: "fs",
                        'fs-extra': "ex-extra",
                        path: "path",
                        glob: "glob",
                        module: "module",
                        inquirer: "inquirer",
                        lodash: "lodash",
                        commander: "commander",
                        chalk: "chalk",
                    }
                },
                external: [
                    'fs',
                    'fs-extra',
                    'glob',
                    'path',
                    'chalk',
                    'lodash',
                    'module',
                    'commander',
                    'inquirer',
                    '@preact/preset-vite',
                    'is-unicode-supported'
                ],
            },
        }
    }


    return config
})
