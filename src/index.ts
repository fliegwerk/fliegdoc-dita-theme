import { CreateFileFunction, FliegdocConfig, Theme, Tree } from 'fliegdoc';

import { processModule } from './processModule';
import path from 'path';
import { render } from './render';

export const FliegdocDITATheme: Theme = {
	async onBuild(
		tree: Tree,
		config: FliegdocConfig,
		createFile: CreateFileFunction
	): Promise<void> {
		await render(
			'template/api_reference.ditamap',
			{ modules: Object.keys(tree) },
			path.join(config.outDir, 'index.ditamap'),
			createFile
		);
		await render(
			'template/intro.dita',
			{},
			path.join(config.outDir, 'intro.dita'),
			createFile
		);

		await Promise.all(
			Object.keys(tree).map(async moduleName => {
				await processModule({
					createFile,
					config: config,
					moduleName: moduleName,
					tree
				});
			})
		);
	},
	isBrowserViewable: false
};
