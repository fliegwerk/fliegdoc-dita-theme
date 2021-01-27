const path = require('path');

const fliegdocPath = path.dirname(path.dirname(require.resolve('fliegdoc')));
const fliegdocPackage = require(path.join(fliegdocPath, 'package.json'));

/**
 *
 * @type {import('fliegdoc').FliegdocConfig}
 */
module.exports = {
	modules: [
		{
			package: './package.json',
			tsconfig: './project/tsconfig.json',
			mainFile: 'index.d.ts'
		},
		{
			package: './package2.json',
			tsconfig: './project/tsconfig.json',
			mainFile: 'index.d.ts'
		}
	],
	theme: require('./dist').FliegdocDITATheme
};
