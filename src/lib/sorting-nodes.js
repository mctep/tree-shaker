const _ = require('lodash');
const Tree = require('./tree');

function getNodesForSorting(tree) {
	return tree.toList().filter((node) => {
		if (!node.data.selected) {
			return false;
		}

		const ancestors = tree.getAncestors(node);
		const hasSelectedAncestor = _.some(ancestors, (ancestor) => {
			return ancestor.data.selected;
		});

		return !hasSelectedAncestor;
	});
}

function move(direction, nodes) {
	let hasMoved = false;

	_.each(_.groupBy(nodes, 'parent'), (group) => {
		const length = group.length;
		let idx = 0;
		let moved = true;

		while (moved && idx < length) {
			const node = group[idx];

			moved = direction === 'up'
				? Tree.moveNodeUp(node)
				: Tree.moveNodeDown(node);

			if (moved) {
				hasMoved = true;
			}

			idx += 1;
		}
	});

	return hasMoved;
}

function moveUp(nodes) {
	return move('up', nodes);
}

function moveDown(nodes) {
	return move('down', nodes.reverse());
}

module.exports = {
	getNodesForSorting,
	moveDown,
	moveUp,
};
