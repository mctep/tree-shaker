module.exports = function getAncestors(node, rootNode) {
	const result = [];
	let { parent } = node;

	while (parent && parent !== rootNode) {
		result.push(parent);
		parent = parent.parent;
	}

	return result;
};
