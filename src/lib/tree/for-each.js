const loopChecker = require('./loop-checker');
const getNearestAncestorWithNext = require('./get-nearest-ancestor-with-next');

module.exports = function forEach(rootNode, iterator) {
	const checkLooping = loopChecker();
	let node = rootNode.first;

	while (node) {
		checkLooping(node);
		iterator(node);

		node = node.first || node.next ||
			getNearestAncestorWithNext(node, rootNode);
	}
};
