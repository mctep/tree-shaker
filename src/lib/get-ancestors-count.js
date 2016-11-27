module.exports = function getAncestorsCount(node) {
	let count = 0;
	let parent = node.parent;

	while (parent) {
		count += 1;
		parent = parent.parent;
	}

	return count;
};
