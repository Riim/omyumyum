import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/OmYumYum.ts',

	output: {
		file: './dist/OmYumYum.umd.js',
		format: 'umd',
		name: 'omyumyum'
	},

	plugins: [
		resolve({ browser: true }),
		tslint(),
		typescript({ clean: true })
	]
};
