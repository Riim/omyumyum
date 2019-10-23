import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/omnamnam.ts',

	output: {
		file: './dist/omnamnam.umd.js',
		format: 'umd',
		name: 'omnamnam'
	},

	plugins: [
		resolve({ browser: true }),
		tslint(),
		typescript({ clean: true })
	]
};
