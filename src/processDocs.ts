export function processDocs(raw: string): string {
	return (
		'<p>' +
		raw
			.split('\r')
			.join('')
			.replace(/[<]/g, '&lt;')
			.replace(/[>]/g, '&gt;')
			.split('\n\n')
			.join('</p><p>')
			.replace(
				/```([a-z])*\n([\w\W]+)\n```/,
				'<codeblock outputClass="language-$1">$2</codeblock>'
			)
			.replace(/`(.+?)`/g, '<codeph>$1</codeph>')
			.replace(/_(.+?)_/g, '<i>$1</i>')
			.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') +
		'</p>'
	);
}
