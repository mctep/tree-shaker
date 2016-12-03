const createTreeTester = require('./test-tree-scheme');
const moveToChosen = require('lib/move-to-chosen');

const moveToChosenTest = createTreeTester(moveToChosen);

describe('moveToChosen', () => {
	moveToChosenTest(`
		1
		1 / 1.1
		1 / 1.1 / 1.1.2 selected
		1 / 1.2
		=
	`, `
		1
		1 / 1.1
		1 / 1.1 / 1.1.2 hidden
		1 / 1.2
		=
		1.1.2
	`);


	moveToChosenTest(`
		1
		1 / 1.1 selected
		1 / 1.1 / 1.1.2
		1 / 1.2
		=
	`, `
		1
		1 / 1.1 hidden
		1 / 1.1 / 1.1.2 hidden
		1 / 1.2
		=
		1.1
		1.1 / 1.1.2
	`);

	moveToChosenTest(`
		1
		1 / 1.1 hidden
		1 / 1.1 / 1.1.2
		1 / 1.2 selected
		2 hidden
		=
		1.1
		2
	`, `
		1
		1 / 1.1 hidden
		1 / 1.1 / 1.1.2
		1 / 1.2 hidden
		2 hidden
		=
		1.1
		2
		1.2
	`);

	moveToChosenTest(`
		1
		1 / 1.1 hidden
		1 / 1.1 / 1.1.2 selected
		1 / 1.2 hidden
		2 hidden
		=
		1.1
		2
		1.2
	`, `
		1
		1 / 1.1 hidden
		1 / 1.1 / 1.1.2 hidden
		1 / 1.2 hidden
		2 hidden
		=
		1.1
		1.1 / 1.1.2
		2
		1.2
	`);

	moveToChosenTest(`
		1 selected
		1 / 1.1 hidden
		1 / 1.1 / 1.1.2 hidden
		1 / 1.2 hidden
		2 hidden
		3 hidden
		=
		2
		1.1
		1.1 / 1.1.2
		3
		1.2
	`, `
		1 hidden
		1 / 1.1 hidden
		1 / 1.1 / 1.1.2 hidden
		1 / 1.2 hidden
		2 hidden
		3 hidden
		=
		2
		3
		1
		1 / 1.1
		1 / 1.1 / 1.1.2
		1 / 1.2
	`);

	moveToChosenTest(`
		1 selected
		1 / 1.1
		1 / 1.1 / 1.1.2 selected
		1 / 1.2
		2 hidden
		3 hidden
		=
		2
		3
	`, `
		1 hidden
		1 / 1.1
		1 / 1.1 / 1.1.2 hidden
		1 / 1.2
		2 hidden
		3 hidden
		=
		2
		3
		1
		1 / 1.1.2
	`);

	moveToChosenTest(`
		1 selected
		1 / 1.1 hidden
		=
		1.1
	`, `
		1 hidden
		1 / 1.1 hidden
		=
		1
		1 / 1.1
	`);
});
