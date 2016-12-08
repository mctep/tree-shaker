const _ = require('lodash');

function serializeChosenTree(tree) {
	const serializedNodes = [];

	tree.forEach((node) => {
		const { id, parent, data } = node;

		const serializedNode = _.assign({ id }, _.omit(data, [
			'availableNode',
			'selected',
			'hidden',
			'disabled',
		]));

		if (parent && parent !== tree.rootNode) {
			serializedNode.parentId = parent.id;
		}

		serializedNodes.push(serializedNode);
	});

	return serializedNodes;
}

module.exports = serializeChosenTree;
