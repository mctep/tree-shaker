const _ = require('lodash');

function getScrollForAboveItem(options) {
	const {
		item,
		itemHeight,
		items,
		visibleItems,
	} = options;

	const shouldScroll = visibleItems[0] === item ||
	!_.includes(visibleItems, item);

	if (!shouldScroll) {
		return null;
	}

	return items.indexOf(item) * itemHeight;
}

function getScrollForBelowItem(options) {
	const {
		containerHeight,
		item,
		itemHeight,
		items,
		visibleItems,
	} = options;

	const first = -1;
	const penult = -2;

	const shouldScroll = _.nth(visibleItems, first) === item ||
	_.nth(visibleItems, penult) === item ||
	!_.includes(visibleItems, item);

	if (!shouldScroll) {
		return null;
	}

	return (itemHeight * (_.lastIndexOf(items, item) + 1)) - containerHeight;
}

module.exports = {
	getScrollForAboveItem,
	getScrollForBelowItem,
};
