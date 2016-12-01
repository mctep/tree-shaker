const _ = require('lodash');

function selectRegion(items, current, last) {
	const length = items.length;
	const result = [];

	function endRegion(matched, item) {
		if (matched && result.length) {
			result.push(item);

			return result;
		}

		return null;
	}

	function addToRegion(matched, item) {
		if (matched || result.length) {
			result.push(item);
		}
	}

	for (let idx = 0; idx < length; idx += 1) {
		const item = items[idx];
		const matched = _.includes([current, last], item);

		if (endRegion(matched, item)) {
			return result;
		}

		addToRegion(matched, item);
	}

	return result;
}

function toggleSingleSelection(items, current) {
	if (_.includes(items, current)) {
		return _.without(items, current);
	}

	return items.concat([current]);
}

module.exports = {
	selectRegion,
	toggleSingleSelection,
};
