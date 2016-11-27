function makeFlatList(nodes) {
	if (!nodes.length) {
		return [];
	}

	let result = [];

	nodes.forEach((node) => {
		result.push(node);
		result = result.concat(makeFlatList(node.children));
	});

	return result;
}

function normalize(items) {
	const index = {};
	const root = [];

	function appendNode(item) {
		const { id } = item;

		index[id] = Object.assign(
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
	});

	const list = makeFlatList(root);

	return { index, list, root };
}

module.exports = normalize;
