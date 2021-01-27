import { processDocs } from './processDocs';

describe('Documentation processor', () => {
	const testCases = [
		`
\`\`\`ts
An example text

With two newlines
\`\`\`
`,
		`
\`\`\`ts
An example text

With two newlines
\`\`\`

And two paragraphs

outside the code
`
	];

	for (let testCase of testCases) {
		it(
			'should correctly process test case #' + testCase.indexOf(testCase),
			() => {
				expect(processDocs(testCase)).toMatchSnapshot();
			}
		);
	}
});
