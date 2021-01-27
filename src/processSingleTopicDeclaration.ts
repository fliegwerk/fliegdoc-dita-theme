import { CreateFileFunction, ModuleTreeNode } from 'fliegdoc';
import { render } from './render';
import path from 'path';
import { processDocs } from './processDocs';

export async function processSingleTopicDeclaration(
	v: Record<string, unknown> & { name: string; declarations: ModuleTreeNode[] },
	moduleDocsFolder: string,
	createFile: CreateFileFunction
): Promise<{ type: 'topic'; url: string }> {
	const url = `./members/${v.name}/index.dita`;
	const declaration = v.declarations[0];
	let internalDeclaration = declaration.declarations[0];

	let docTags = [];

	if (internalDeclaration['docs'].length > 0)
		docTags = internalDeclaration['docs'][0].tags
			.filter(tag => {
				const twoPartTagRegex = /^(\w+) - ([\s\S]+)$/m;
				if (tag.tagName === '@param') {
					if (!twoPartTagRegex.test(tag.text)) {
						console.warn('Parameter description not in valid format.');
						console.info(
							`Expected "[param-name] - [description]", but got ${tag.text}`
						);
						return true;
					}

					const match = twoPartTagRegex.exec(tag.text);
					const paramName = match[1];
					const description = processDocs(match[2]);

					if (!internalDeclaration['parameters']) {
						console.warn(
							`@param tag found in non-function declaration on ${internalDeclaration['name']}`
						);
						return true;
					}

					const index = (internalDeclaration['parameters'] as any[]).findIndex(
						v => v.name === paramName
					);

					if (index < 0) {
						console.warn(
							`parameter not found: ${paramName} in ${internalDeclaration['name']}`
						);
						return true;
					}

					internalDeclaration['parameters'][index]['description'] = description;
				} else if (tag.tagName === '@returns') {
					internalDeclaration['returnDescription'] = processDocs(tag.text);
					return false;
				}

				return true;
			})
			.map(tag => ({ ...tag, text: processDocs(tag.text) }));

	const description = internalDeclaration['docs'].length
		? processDocs(
				internalDeclaration['docs'][0].description || 'No docs provides'
		  )
		: 'No docs provided';

	await render(
		`partials/${declaration.type}.dita`,
		{
			declaration: internalDeclaration,
			description,
			docTags
		},
		path.join(moduleDocsFolder, url),
		createFile
	);

	return {
		type: 'topic',
		url
	};
}
