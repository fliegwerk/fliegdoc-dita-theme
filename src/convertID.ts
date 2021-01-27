export function convertID(raw: string) {
	return (
		'FLIEGDOC_GEN_ID_' +
		raw.replace(/\s/g, '__').replace(/\./g, '_').replace(/@/g, '__')
	);
}
