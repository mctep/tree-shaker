const assign = require('lodash/assign');

function compare(node1, node2) {
	const index1 = getAnchestorsPath(node1);
	const index2 = getAnchestorsPath(node2);

	if (index1 > index2) {
		return 1;
	}

	if (index1 < index2) {
		return -1;
	}

	return 0;
}


function getAnchestorsPath(node) {
	if (node.anchestorsIds) {
		return node.anchestorsIds.join('/');
	}

	const result = [node.id];
	let parent = node.parent;

	while (parent) {
		result.unshift(parent.id);
		parent = parent.parent;
	}

	node.anchestorsIds = result;

	return result.join('/');
}

function normalize(items) {
	const index = {};
	const root = [];
	const list = [];

	function appendNode(item) {
		const { id } = item;

		index[id] = assign(
			index[id] || { children: [], parent: null }, item
		);

		return index[id];
	}

	items.forEach((item) => {
		const node = appendNode(item);

		if (item.parentId) {
			node.parent = appendNode({ id: item.parentId });
			node.parent.children.push(node);
		} else {
			root.push(node);
		}

		list.push(node);
	});

	list.sort(compare);
	root.sort(compare);

	return { index, list, root };
}

module.exports = normalize;
