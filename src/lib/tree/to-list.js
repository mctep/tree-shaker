const loopChecker = require('./loop-checker');
const getNearestAncestorWithNext = require('./get-nearest-ancestor-with-next');

module.exports = function toList(rootNode) {
	const result = [];
	const checkLooping = loopChecker();
	let node = rootNode.first;

	while (node) {
		checkLooping(node);
		result.push(node);
		node = node.first || node.next ||
			getNearestAncestorWithNext(node, rootNode);
	}

	return result;
};
