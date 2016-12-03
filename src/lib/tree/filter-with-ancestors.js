const loopChecker = require('./loop-checker');
const getAncestors = require('./get-ancestors');
const getNearestAncestorWithNext = require('./get-nearest-ancestor-with-next');
const toList = require('./to-list');


module.exports = function filterWithAncestors(rootNode, checker) {
	const result = [];

	const checkLooping = loopChecker();
	const filteredIndex = {};
	let node = rootNode.first;

	function addNode(item) {
		const { id } = item;

		if (!filteredIndex[id]) {
			result.push(item);
			filteredIndex[id] = true;
		}
	}

	function addIfFiltered(item) {
		if (!checker(item)) {
			return;
		}

		getAncestors(item, rootNode).reverse().forEach(addNode);
		addNode(item);
		toList(item).forEach(addNode);
	}

	while (node) {
		checkLooping(node);
		addIfFiltered(node);

		node = node.first || node.next ||
			getNearestAncestorWithNext(node, rootNode);
	}

	return result;
};
