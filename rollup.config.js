import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/OmYumYum.ts',

	output: {
		file: './dist/OmYumYum.umd.js',
		format: 'umd',
		name: 'omyumyum',
		// Consumers of your bundle will have to use chunk['default'] to access their default export, which may not be what you want. Use `output.exports: 'named'` to disable this warning
		exports: 'named'
	},

	plugins: [
		resolve({ browser: true }),
		tslint(),
		typescript({ clean: true })
	]
};
