module.exports = function getNearestAncestorWithNext(node, rootNode) {
	let { parent } = node;

	while (parent && parent !== rootNode) {
		if (parent.next) {
			return parent.next;
		}

		parent = parent.parent;
	}

	return null;
};
