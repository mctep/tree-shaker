const createTreeTester = require('./test-tree-scheme');
const removeFromChosen = require('lib/remove-from-chosen');

const removeFromChosenTest = createTreeTester(removeFromChosen);

describe('removeFromChosen', () => {
	removeFromChosenTest(`
		1 hidden
		=
		1 selected
	`, `
		1
		=
	`);

	removeFromChosenTest(`
		1 hidden
		1 / 1.1 hidden
		=
		1
		1 / 1.1 selected
	`, `
		1 hidden
		1 / 1.1
		=
		1
	`);
});
