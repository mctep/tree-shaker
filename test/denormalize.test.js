const { expect } = require('chai');
const denormalize = require('tree-shaker/lib/denormalize');

it('should make right denormalize', () => {
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
		id: '1',
		parentId: null,
	});

	const node2 = Object.assign({}, {
		id: '2',
		parentId: '1',
	});

	const node3 = Object.assign({}, {
		id: '3',
		parentId: null,
	});

	const node4 = Object.assign({}, {
		id: '4',
		parentId: '2',
	});

	const rootNode = {
		children: [node1, node3],
		id: null,
		parent: null,
		parentId: null,
	};

	node1.parent = rootNode;
	node1.children = [node2];

	node2.parent = node1;
	node2.children = [node4];

	node3.parent = rootNode;
	node3.children = [];

	node4.parent = node2;
	node4.children = [];

	const input = [item1, item2, item3, item4];
	const output = {
		[denormalize.root]: rootNode,
		1: node1,
		2: node2,
		3: node3,
		4: node4,
	};

	expect(denormalize(input)).to.be.deep.equal(output);
});
