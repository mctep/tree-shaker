const _ = require('lodash');
const Tree = require('./tree');

function moveToChosen(trees) {
	const { available, chosen } = trees;
	const availableList = available.toList();

	const selected = _.filter(availableList, (node) => {
		return node.data.selected;
	});

	let moving = [].concat(selected);

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

		moving = moving.concat(sublist);
	});

	moving.forEach(move);

	return trees;

	function move(availableNode) {
		const { id, data } = availableNode;

		const parent = chosen.getNodeById(data.parentId);
		const rawNode = { availableNode, id };

		if (parent) {
			rawNode.parentId = parent.id;
		}

		const chosenNode = chosen.addRawNode(rawNode);

		Tree.getChildren(availableNode).forEach((node) => {
			const childChosenNode = chosen.getNodeById(node.id);

			if (!childChosenNode) {
				return;
			}

			chosen.moveNodeToParent(childChosenNode, chosenNode);
		});

		available.getAncestors(availableNode).reverse().forEach((node) => {
			const ancestorChosenNode = chosen.getNodeById(node.id);

			if (!ancestorChosenNode) {
				return;
			}

			chosen.moveNodeToParent(chosenNode, ancestorChosenNode);
		});

		data.selected = false;
		data.hidden = true;

		return chosenNode;
	}
}


module.exports = moveToChosen;
