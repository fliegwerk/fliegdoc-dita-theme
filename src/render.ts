import path from 'path';
import { CreateFileFunction } from 'fliegdoc';
import { renderFile } from 'eta';

const viewFolder = path.join(__dirname, '..', 'views');

/**
 * Render a view to a target file (the `outPath`)
 *
 * @param view - the view that should get rendered, without `.ejs` and relative to the `views` folder
 * @param data - the data passed to the view
 * @param outPath - the path to the file where the view gets rendered to
 * @param createFile - function to create a file
 * @example
 * ```ts
 * render('plain', {
 *  	content: '<h1>Test</h1>'
 *		modules: modules,
 *		config
 * }, path.join(outDir, 'test.html'))
 * ```
 */
export async function render(
	view: string,
	data: Record<string, unknown>,
	outPath: string,
	createFile: CreateFileFunction
): Promise<void> {
	await createFile(
		outPath,
		Buffer.from(
			(
				await (renderFile(path.resolve(viewFolder, view + '.eta'), data, {
					views: viewFolder
				}) || Promise.reject('Error rendering view ' + view))
			).toString(),
			'utf-8'
		),
		'text/xml'
	);
}
