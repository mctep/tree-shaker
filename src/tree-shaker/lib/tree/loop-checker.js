module.exports = function loopChecker() {
	const index = {};

	return (node) => {
		if (index[node.id]) {
			throw new Error(`Looping detected "${node.id}"`);
		}

		index[node.id] = true;
	};
};
