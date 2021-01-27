const NEWLINE_IN_CODE_PLACEHOLDER = 'REPLACENINCODE' + Date.now();
const BACKTICK_IN_CODE_PLACEHOLDER = 'REPLACEBINCODE' + Date.now();
const MULTIPLY_IN_CODE_PLACEHOLDER = 'REPLACEMINCODE' + Date.now();
const UNDERSCORE_IN_CODE_PLACEHOLDER = 'REPLACEUINCODE' + Date.now();

export function processDocs(raw: string): string {
	return (
		'<p>' +
		raw
			.split('\r')
			.join('')
			.replace(/[<]/g, '&lt;')
			.replace(/[>]/g, '&gt;')
			.replace(
				/```([a-z])*\n([\w\W]+)\n```/,
				(...results) =>
					`<codeblock outputClass="language-${results[1]}">${results[2]
						.split('\n')
						.join(NEWLINE_IN_CODE_PLACEHOLDER)
						.split('`')
						.join(BACKTICK_IN_CODE_PLACEHOLDER)
						.split('*')
						.join(MULTIPLY_IN_CODE_PLACEHOLDER)
						.split('_')
						.join(UNDERSCORE_IN_CODE_PLACEHOLDER)}</codeblock>`
			)
			.split('\n\n')
			.join('</p><p>')
			.replace(/`(.+?)`/g, '<codeph>$1</codeph>')
			.replace(/_(.+?)_/g, '<i>$1</i>')
			.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
			.split(NEWLINE_IN_CODE_PLACEHOLDER)
			.join('\n')
			.split(MULTIPLY_IN_CODE_PLACEHOLDER)
			.join('*')
			.split(UNDERSCORE_IN_CODE_PLACEHOLDER)
			.join('_')
			.split(BACKTICK_IN_CODE_PLACEHOLDER)
			.join('`') +
		'</p>'
	);
}
