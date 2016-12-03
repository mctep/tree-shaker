const _ = require('lodash');

function getVirtualScrolling(props) {
	const {
		containerHeight,
		currentVisibleItems,
		itemHeight,
		items,
		scrollTop,
	} = props;

	const visibleItemsCount = Math.ceil(containerHeight / itemHeight) + 1;
	const disabledItemsCount = Math.floor(scrollTop / itemHeight);
	const itemsCount = items.length;

	const start = Math.min(itemsCount - 1, disabledItemsCount);
	const end = start + visibleItemsCount;

	const visibleItems = items.slice(start, end);

	const hasChanges = _.difference(visibleItems, currentVisibleItems).length;

	if (!hasChanges) {
		return null;
	}

	const topPadHeight = start * itemHeight;
	const bottomPadHeight = Math.max(0, itemsCount - end) * itemHeight;

	return {
		bottomPadHeight,
		topPadHeight,
		visibleItems,
	};
}

module.exports = getVirtualScrolling;
