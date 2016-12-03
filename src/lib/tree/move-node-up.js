module.exports = function moveNodeUp(node) {
	if (!node.prev) {
		return false;
	}

	const { prev, next, parent } = node;

	node.prev = prev.prev;
	node.next = prev;

	if (node.prev) {
		node.prev.next = node;
	}

	prev.prev = node;
	prev.next = next;

	if (next) {
		next.prev = prev;
		prev.next = next;
	}

	updateParent();

	return true;

	function updateParent() {
		if (parent) {
			const { last, first } = parent;

			if (first === prev) {
				parent.first = node;
			}

			if (last === node) {
				parent.last = prev;
			}
		}
	}
};
