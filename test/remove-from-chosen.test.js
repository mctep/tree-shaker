const { createMovingTester } = require('./test-tree-scheme');
const removeFromChosen = require('tree-shaker/lib/remove-from-chosen');

const tester = createMovingTester();

function removeFromChosenTest(beforeSchema, afterSchema) {
	tester(beforeSchema, removeFromChosen, afterSchema);
}

describe('removeFromChosen', () => {
	removeFromChosenTest(`
		1 disabled
		=
		1 selected
	`, `
		1
		=
	`);

	removeFromChosenTest(`
		1 disabled
		1 / 1.1 disabled
		=
		1
		1 / 1.1 selected
	`, `
		1 disabled
		1 / 1.1
		=
		1
	`);
});
