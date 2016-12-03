const { createChangeTester } = require('./test-tree-scheme');
const Tree = require('lib/tree');

const tester = createChangeTester();

function filterNodesTest(beforeSchema, value, afterSchema) {
	tester(beforeSchema, (tree) => {
		return Tree.filterWithAncestors(tree.rootNode, (node) => {
			return node.id.match(value);
		});
	}, afterSchema);
}

describe('filterNodes', () => {
	filterNodesTest(`
		1
	`, '', `
		1
	`);

	filterNodesTest(`
		1
		2
	`, '2', `
		2
	`);

	filterNodesTest(`
		1
		1 / 1.1
		2
	`, '1', `
		1
		1 / 1.1
	`);

	filterNodesTest(`
		1
		1 / 1.1
		1 / 1.2
		1 / 1.2 / 1.2.3
		2
	`, '2', `
		1
		1 / 1.2
		1 / 1.2 / 1.2.3
		2
	`);

	filterNodesTest(`
		3
		3 / 1.1
		3 / 1.2
		3 / 1.2 / 1.2.3
		2
	`, '3', `
		3
		3 / 1.1
		3 / 1.2
		3 / 1.2 / 1.2.3
	`);
});
