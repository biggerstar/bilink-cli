import path from "path";
import {defineConfig} from "vite";
import {buildPlugin} from 'vite-plugin-build'
// import requireTransform from 'vite-plugin-require-transform/dist/index.js'
import commonjs from "@rollup/plugin-commonjs"


export default defineConfig({
    // mode: 'development',
    plugins: [
        // requireTransform(),
        // commonjs(),
        // buildPlugin({
        //     fileBuild: false,
        //     libBuild: {
        //         buildOptions: {
        //             rollupOptions: {
        //                 external: [
        //                     // 'rollup',
        //                     // "#ansi-styles",
        //                     // '#supports-color',
        //                     // 'fsevents',
        //                     // '__vite-browser-external',
        //                     // 'commander',
        //                 ],
        //             },
        //             lib: {
        //                 entry: path.resolve(process.cwd(), './units/test.js'),
        //                 name: 'bilink',
        //                 fileName: (format) => `bilinkCli.js`,
        //             },
        //         },
        //     },
        // })
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: path.resolve(process.cwd(), `./test.js`),
            format: ['es'],
            name: 'bilinkCli',
            fileName: 'bilinkCli',
        }
    }
})
