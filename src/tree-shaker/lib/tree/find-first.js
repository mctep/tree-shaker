const loopChecker = require('./loop-checker');
const getNearestAncestorWithNext = require('./get-nearest-ancestor-with-next');

// eslint-disable-next-line complexity
module.exports = function findFirst(rootNode, checker) {
	const checkLooping = loopChecker();
	let node = rootNode.first;

	while (node) {
		checkLooping(node);

		if (checker(node)) {
			return node;
		}

		node = node.first || node.next ||
			getNearestAncestorWithNext(node, rootNode);
	}

	return null;
};
