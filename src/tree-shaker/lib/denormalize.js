const rootSymbol = Symbol('root');

function denormalize(items) {
	const index = {
		[rootSymbol]: {
			children: [],
			id: null,
			parent: null,
			parentId: null,
		},
	};

	function appendNode(item) {
		const { id } = item;

		index[id] = Object.assign(
			index[id] || { children: [], parent: null }, item
		);

		return index[id];
	}

	items.forEach((item) => {
		const node = appendNode(item);

		const parent = item.parentId
			? appendNode({ id: item.parentId })
			: index[rootSymbol];

		parent.children.push(node);
		node.parent = parent;
	});

	return index;
}

denormalize.root = rootSymbol;

module.exports = denormalize;
