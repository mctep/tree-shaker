const { expect } = require('chai');
const normalize = require('lib/normalize');

it('should make right normalize', () => {
	const item1 = {
		id: '1',
		parentId: null,
	};

	const item2 = {
		id: '2',
		parentId: '1',
	};

	const item3 = {
		id: '3',
		parentId: null,
	};

	const item4 = {
		id: '4',
		parentId: '2',
	};

	const node1 = Object.assign({}, {
		anchestorsIds: ['1'],
		id: '1',
		parentId: null,
	});

	const node2 = Object.assign({}, {
		anchestorsIds: ['1', '2'],
		id: '2',
		parentId: '1',
	});

	const node3 = Object.assign({}, {
		anchestorsIds: ['3'],
		id: '3',
		parentId: null,
	});

	const node4 = Object.assign({}, {
		anchestorsIds: ['1', '2', '4'],
		id: '4',
		parentId: '2',
	});

	node1.parent = null;
	node1.children = [node2];

	node2.parent = node1;
	node2.children = [node4];

	node3.parent = null;
	node3.children = [];

	node4.parent = node2;
	node4.children = [];

	const input = [item4, item3, item2, item1];
	const output = {
		index: {
			1: node1,
			2: node2,
			3: node3,
			4: node4,
		},
		list: [
			node1,
			node2,
			node4,
			node3,
		],
		root: [node1, node3],
	};

	expect(normalize(input)).to.be.deep.equal(output);
});
