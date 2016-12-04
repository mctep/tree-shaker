const _ = require('lodash');
const { expect } = require('chai');
const Tree = require('tree-shaker/lib/tree');

function makeSchema(list) {
	return list.map((node) => {
		const { id, data } = node;
		const { selected, disabled } = data;
		const ancestorsIds = _.map(Tree.getAncestors(node).reverse(), 'id');

		ancestorsIds.shift();
		ancestorsIds.push(id);

		let result = ancestorsIds.join(' / ');

		if (selected) {
			result += ' selected';
		}

		if (disabled) {
			result += ' disabled';
		}

		return result;
	}).join('\n');
}

function parseLine(line) {
	const path = line.replace(/(selected|disabled)/g, '').split('/');
	const id = path.slice(-1)[0];
	const parentId = path.length > 1
		? path.slice(-2)[0]
		: null;

	const selected = Boolean(line.match(/selected/));
	const disabled = Boolean(line.match(/disabled/));

	return { disabled, id, parentId, selected };
}

function parseSchema(schema) {
	const lines = _.compact(schema.replace(/ |\t/g, '').split('\n'));

	return new Tree(lines.map(parseLine));
}

function parseMovingSchema(schema) {
	const [availableSchema, chosenSchema] = schema.split('=');

	const available = parseSchema(availableSchema);
	const chosen = parseSchema(chosenSchema);

	return { available, chosen };
}

function createMovingTester() {
	let testIdx = 0;

	return (beforeSchema, testFn, afterSchema) => {
		testIdx += 1;

		it(`case #${testIdx}`, () => {
			const before = parseMovingSchema(beforeSchema);
			const after = parseMovingSchema(afterSchema);

			const expectedSchema = [
				makeSchema(after.available.toList()), makeSchema(after.chosen.toList()),
			].join('\n=\n');

			const result = testFn(before);

			const actualSchema = [
				makeSchema(result.available.toList()),
				makeSchema(result.chosen.toList()),
			].join('\n=\n');

			expect(actualSchema).to.be.equal(expectedSchema);

			expect(_.keys(result.available.index).length)
			.to.be.equal(result.available.toList().length);
			expect(_.keys(result.chosen.index).length)
			.to.be.equal(result.chosen.toList().length);
		});
	};
}

function createChangeTester() {
	let testIdx = 0;

	return (beforeSchema, testFn, afterSchema) => {
		testIdx += 1;

		it(`case #${testIdx}`, () => {
			const before = parseSchema(beforeSchema);
			const after = parseSchema(afterSchema);

			const result = testFn(before);

			const expectedSchema = makeSchema(after.toList());
			const actualSchema = makeSchema(result);

			expect(actualSchema).to.be.equal(expectedSchema);
		});
	};
}

module.exports = {
	createChangeTester,
	createMovingTester,
};
