const _ = require('lodash');
const { expect } = require('chai');
const Tree = require('lib/tree');
const moveToChosen = require('lib/move-to-chosen');

let testIdx = 0;

describe('moveToChosen', () => {
	chooseTest(`
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


	chooseTest(`
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

	chooseTest(`
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

	chooseTest(`
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

	chooseTest(`
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

	chooseTest(`
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
});

function makeSchema(list) {
	return list.map((node) => {
		const { id, data } = node;
		const { selected, hidden } = data;
		const anchestorsIds = _.map(Tree.getAncestors(node).reverse(), 'id');

		anchestorsIds.shift();
		anchestorsIds.push(id);

		let result = anchestorsIds.join(' / ');

		if (selected) {
			result += ' selected';
		}

		if (hidden) {
			result += ' hidden';
		}

		return result;
	}).join('\n');
}

function parseLine(line) {
	const path = line.replace(/(selected|hidden)/g, '').split('/');
	const id = path.slice(-1)[0];
	const parentId = path.length > 1
		? path.slice(-2)[0]
		: null;

	const selected = line.match(/selected/);
	const hidden = line.match(/hidden/);

	return { hidden, id, parentId, selected };
}


function parseSchema(schema) {
	const [availableSchema, chosenSchems] =
		schema.replace(/ |\t/g, '').split('=');
	const availableLines = _.compact(availableSchema.split('\n'));
	const chosenLines = _.compact(chosenSchems.split('\n'));

	const available = new Tree(availableLines.map(parseLine));
	const chosen = new Tree(chosenLines.map(parseLine));

	return { available, chosen };
}

function chooseTest(beforeSchema, afterSchema) {
	testIdx += 1;

	it(`case #${testIdx}`, () => {
		const before = parseSchema(beforeSchema);
		const after = parseSchema(afterSchema);

		const expectedSchema = [
			makeSchema(after.available.toList()), makeSchema(after.chosen.toList()),
		].join('\n=\n');

		const result = moveToChosen(before);

		const actualSchema = [
			makeSchema(result.available.toList()),
			makeSchema(result.chosen.toList()),
		].join('\n=\n');

		expect(actualSchema).to.be.equal(expectedSchema);
	});
}
