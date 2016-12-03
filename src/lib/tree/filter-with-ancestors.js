const loopChecker = require('./loop-checker');
const getAncestors = require('./get-ancestors');
const getNearestAncestorWithNext = require('./get-nearest-ancestor-with-next');

// eslint-disable-next-line complexity
module.exports = function filterWithAncestors(rootNode, checker) {
	const result = [];

	const checkLooping = loopChecker();
	const filteredIndex = {};
	let node = rootNode.first;

	while (node) {
		checkLooping(node);

		if (checker(node)) {
			getAncestors(node, rootNode).reverse()
			.forEach((ancestor) => {
				if (!filteredIndex[ancestor.id]) {
					result.push(ancestor);
					filteredIndex[ancestor.id] = true;
				}
			});

			result.push(node);
			filteredIndex[node.id] = true;
		}

		node = node.first || node.next ||
			getNearestAncestorWithNext(node, rootNode);
	}

	return result;
};
