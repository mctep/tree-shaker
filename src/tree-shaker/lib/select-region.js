const _ = require('lodash');

function selectRegion(items, current, last) {
	const length = items.length;
	let inSelection = false;

	function select(matched, item) {
		if (matched || inSelection) {
			inSelection = true;
			item.data.selected = true;
		}
	}

	for (let idx = 0; idx < length; idx += 1) {
		const item = items[idx];
		const matched = _.includes([current, last], item);

		if (matched && inSelection) {
			item.data.selected = true;

			return;
		}

		select(matched, item);
	}
}

module.exports = selectRegion;
