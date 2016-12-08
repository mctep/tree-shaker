const _ = require('lodash');

function pickChosenNodesFromAvailable(chosenNodes, availableTree) {
	const esxistsNodes = [];

	chosenNodes.forEach((node) => {
		const { id, parentId } = node;
		const availableNode = availableTree.getNodeById(id);

		if (!availableNode) {
			return;
		}

		if (parentId) {
			const ancestorsIds = _.map(
				availableTree.getAncestors(availableNode),
				'id'
			);

			if (!_.intersection(ancestorsIds, [parentId]).length) {
				return;
			}
		}

		node.availableNode = availableNode;
		availableNode.data.disabled = true;
		esxistsNodes.push(node);
	});

	return esxistsNodes;
}

module.exports = pickChosenNodesFromAvailable;
