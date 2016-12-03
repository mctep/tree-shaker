module.exports = function getChildren(node) {
	const result = [];
	let child = node.first;

	while (child) {
		result.push(child);
		child = child.next;
	}

	return result;
};
