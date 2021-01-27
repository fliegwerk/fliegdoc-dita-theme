import { CreateFileFunction, FliegdocConfig, ModuleTree, Tree } from 'fliegdoc';
import path from 'path';
import { render } from './render';
import { processSingleTopicDeclaration } from './processSingleTopicDeclaration';
import { processClasslike } from './processClasslike';

export async function processModule({
	createFile,
	config,
	moduleName,
	tree
}: {
	createFile: CreateFileFunction;
	config: FliegdocConfig;
	moduleName: string;
	tree: Tree;
}) {
	const moduleDocsFolder = path.join(config.outDir, 'modules', moduleName);

	const exportedMembers = tree[moduleName];
	const memberRefs = await processModuleMembers(
		exportedMembers,
		moduleDocsFolder,
		createFile
	);

	const moduleMapPath = path.join(
		config.outDir,
		'modules',
		moduleName,
		`index.ditamap`
	);
	await render(
		'template/modules/module/index.ditamap',
		{
			members: memberRefs,
			moduleName
		},
		moduleMapPath,
		createFile
	);
	await render(
		'template/modules/module/intro.dita',
		{ moduleName },
		path.join(config.outDir, 'modules', moduleName, `intro.dita`),
		createFile
	);

	return moduleMapPath;
}

async function processModuleMembers(
	exportedMembers: ModuleTree,
	moduleDocsFolder: string,
	createFile: CreateFileFunction
) {
	return (
		await Promise.all(
			exportedMembers.map<
				Promise<{ type: 'map' | 'topic'; url: string } | undefined>
			>(async v => {
				if (v.declarations[0]) {
					if (
						(['function', 'type', 'variable'] as const).includes(
							(v.declarations[0].type as unknown) as any
						)
					) {
						return processSingleTopicDeclaration(
							v,
							moduleDocsFolder,
							createFile
						);
					} else {
						if (
							v.declarations[0].type === 'class' ||
							v.declarations[0].type === 'interface'
						) {
							return await processClasslike(moduleDocsFolder, v, createFile);
						}
						return undefined;

						// const url = `./members/${v.name}/index.ditamap`;
						// await render('template/modules/module/members/class/index.ditamap', {}, path.join(moduleDocsFolder, url), createFile)
						//
						// return {
						//     type: 'map',
						//     url
						// }
					}
				}

				return undefined;
			})
		)
	).filter(v => v);
}
