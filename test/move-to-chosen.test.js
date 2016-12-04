const { createMovingTester } = require('./test-tree-scheme');
const moveToChosen = require('tree-shaker/lib/move-to-chosen');

const tester = createMovingTester();

function moveToChosenTest(beforeSchema, afterSchema) {
	tester(beforeSchema, moveToChosen, afterSchema);
}

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
		1 / 1.1 / 1.1.2 disabled
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
		1 / 1.1 disabled
		1 / 1.1 / 1.1.2 disabled
		1 / 1.2
		=
		1.1
		1.1 / 1.1.2
	`);

	moveToChosenTest(`
		1
		1 / 1.1 disabled
		1 / 1.1 / 1.1.2
		1 / 1.2 selected
		2 disabled
		=
		1.1
		2
	`, `
		1
		1 / 1.1 disabled
		1 / 1.1 / 1.1.2
		1 / 1.2 disabled
		2 disabled
		=
		1.1
		2
		1.2
	`);

	moveToChosenTest(`
		1
		1 / 1.1 disabled
		1 / 1.1 / 1.1.2 selected
		1 / 1.2 disabled
		2 disabled
		=
		1.1
		2
		1.2
	`, `
		1
		1 / 1.1 disabled
		1 / 1.1 / 1.1.2 disabled
		1 / 1.2 disabled
		2 disabled
		=
		1.1
		1.1 / 1.1.2
		2
		1.2
	`);

	moveToChosenTest(`
		1 selected
		1 / 1.1 disabled
		1 / 1.1 / 1.1.2 disabled
		1 / 1.2 disabled
		2 disabled
		3 disabled
		=
		2
		1.1
		1.1 / 1.1.2
		3
		1.2
	`, `
		1 disabled
		1 / 1.1 disabled
		1 / 1.1 / 1.1.2 disabled
		1 / 1.2 disabled
		2 disabled
		3 disabled
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
		2 disabled
		3 disabled
		=
		2
		3
	`, `
		1 disabled
		1 / 1.1
		1 / 1.1 / 1.1.2 disabled
		1 / 1.2
		2 disabled
		3 disabled
		=
		2
		3
		1
		1 / 1.1.2
	`);

	moveToChosenTest(`
		1 selected
		1 / 1.1 disabled
		=
		1.1
	`, `
		1 disabled
		1 / 1.1 disabled
		=
		1
		1 / 1.1
	`);
});
