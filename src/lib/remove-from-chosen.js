const _ = require('lodash');
const Tree = require('./tree');

function removeFromChosen(trees) {
	const { available, chosen } = trees;

	const chosenList = chosen.toList();

	const selected = _.filter(chosenList, (node) => {
		return node.data.selected;
	});

	let removing = [].concat(selected);

	selected.forEach((node) => {
		const sublist = [];

		const hasSelectedDescendant = Tree.findFirst(node, (desc) => {
			if (!desc.data.hidden) {
				sublist.push(desc);
			}

			return desc.data.selected;
		});

		if (hasSelectedDescendant) {
			return;
		}

		removing = removing.concat(sublist);
	});

	removing.forEach((chosenNode) => {
		chosen.removeNode(chosenNode);
		const availableNode = available.getNodeById(chosenNode.id);

		availableNode.data.hidden = false;
	});

	return trees;
}

module.exports = removeFromChosen;
