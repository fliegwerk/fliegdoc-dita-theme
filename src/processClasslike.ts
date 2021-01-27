import { CreateFileFunction, ModuleTreeNode } from 'fliegdoc';
import path from 'path';
import { render } from './render';
import { processSingleTopicDeclaration } from './processSingleTopicDeclaration';
import { processDocs } from './processDocs';

export async function processClasslike(
	moduleDocsFolder: string,
	v: Record<string, unknown> & { name: string; declarations: ModuleTreeNode[] },
	createFile: CreateFileFunction
): Promise<{ type: 'map'; url: string }> {
	const declaration = v.declarations[0];
	const classDocsPath = path.join(
		moduleDocsFolder,
		'members',
		declaration.name
	);
	const mapPath = path.join(classDocsPath, 'index.ditamap');

	let internalDeclaration = declaration.declarations[0];
	const constructors =
		declaration.type === 'class' ? (internalDeclaration['ctors'] as any[]) : [];
	const ctorLinks = await Promise.all(
		constructors.map(async (constructor, i) =>
			processSingleTopicDeclaration(
				{
					type: 'function',
					name: `constructor-${i}`,
					declarations: [
						{
							type: 'function',
							name: 'constructor',
							declarations: [{ ...constructor, name: 'constructor' }]
						}
					]
				},
				classDocsPath,
				createFile
			)
		)
	);
	const properties = internalDeclaration['properties'] as any[];
	const propertyLinks = await Promise.all(
		properties.map(async property =>
			processSingleTopicDeclaration(
				{
					type: 'property',
					name: property.name,
					declarations: [
						{
							type: 'property',
							name: property.name,
							declarations: [property]
						}
					]
				},
				classDocsPath,
				createFile
			)
		)
	);
	const methods = internalDeclaration['methods'] as any[];
	const methodLinks = await Promise.all(
		methods.map(async method =>
			processSingleTopicDeclaration(
				{
					type: 'function',
					name: method.name,
					declarations: [
						{
							type: 'function',
							name: method.name,
							declarations: [method]
						}
					]
				},
				classDocsPath,
				createFile
			)
		)
	);

	let signature = `${declaration['type']} ${internalDeclaration['name']}`;
	if (
		internalDeclaration['typeParameters'] &&
		internalDeclaration['typeParameters'].length
	) {
		signature += '<';
		signature += internalDeclaration['typeParameters']
			.map(tparam => {
				let returnValue = tparam.name;
				if (tparam.constraint) returnValue += `: ${tparam.constraint}`;

				if (tparam.default) returnValue += ` = ${tparam.default}`;

				return returnValue;
			})
			.join(', ');
		signature += '>';
	}
	if (internalDeclaration['extends'] && internalDeclaration['extends'].length) {
		signature += ` extends ${
			internalDeclaration['extends'].join
				? internalDeclaration['extends'].join(', ')
				: internalDeclaration['extends']
		}`;
	}
	if (
		internalDeclaration['implements'] &&
		internalDeclaration['implements'].length
	) {
		signature += ` implements ${internalDeclaration['implements'].join(', ')}`;
	}

	let description = 'No docs provided';
	let docTags = [];
	if (internalDeclaration['docs'] && internalDeclaration['docs'].length > 0) {
		description = internalDeclaration['docs'][0].description || description;
		docTags = internalDeclaration['docs'][0].tags.map(tag => ({
			...tag,
			text: processDocs(tag.text)
		}));
	}

	await render(
		'template/modules/module/members/class-like/index.ditamap',
		{
			declaration: declaration,
			properties: propertyLinks,
			methods: methodLinks,
			constructors: ctorLinks
		},
		mapPath,
		createFile
	);
	await render(
		'template/modules/module/members/class-like/intro.dita',
		{
			declaration: declaration,
			signature,
			description,
			docTags
		},
		path.join(classDocsPath, 'intro.dita'),
		createFile
	);

	return {
		type: 'map',
		url: mapPath
	};
}
