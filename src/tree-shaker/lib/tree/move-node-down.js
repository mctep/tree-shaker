module.exports = function moveNodeDown(node) {
	if (!node.next) {
		return false;
	}

	const { prev, next, parent } = node;

	node.prev = next;
	node.next = next.next;

	if (node.next) {
		node.next.prev = node;
	}

	next.next = node;
	next.prev = prev;

	if (prev) {
		prev.next = next;
		next.prev = prev;
	}

	updateParent();

	return true;

	function updateParent() {
		if (parent) {
			const { last, first } = parent;

			if (last === next) {
				parent.last = node;
			}

			if (first === node) {
				parent.first = next;
			}
		}
	}
};
