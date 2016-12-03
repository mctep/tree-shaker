const { expect } = require('chai');
const Tree = require('lib/tree');

let idx = 0;

describe('Tree', () => {
	test([
		{ id: '6', parentId: null },
		{ id: '5', parentId: '6' },
		{ id: '4', parentId: '6' },
		{ id: '3', parentId: '6' },
		{ id: '1', parentId: '4' },
	], [
		'6',
		'5',
		'4',
		'1',
		'3',
	]);

	test([
		{ id: '2', parentId: null },
		{ id: '3', parentId: null },
		{ id: '1', parentId: null },
		{ id: '1.1', parentId: '1' },
		{ id: '1.1.2', parentId: '1.1' },
		{ id: '1.2', parentId: '1' },
	], [
		'2',
		'3',
		'1',
		'1.1',
		'1.1.2',
		'1.2',
	]);
});

function test(input, output) {
	idx += 1;
	it(`case #${idx}`, () => {
		expect(new Tree(input).toList().map((node) => {
			return node.id;
		})).to.be.deep.equal(output);
	});
}
