// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import analyze from 'rollup-plugin-analyzer';

export default [{
    input: './src/index.tsx',
    output: [
        {
            dir: './dist/scripts/',
            entryFileNames: 'bundle.es.js', 
            format: 'es', 
            sourcemap: true,
            globals: {
                'object-assign': 'Object.assign'
            }
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        replace({
            'process.env.NODE_ENV': '"production"'
        }),
        typescript(),
        compiler(),
        analyze({
            summaryOnly: true,
            hideDeps: true,
            filter: [
                "src"
            ]
        }),
    ],
}];