const _ = require('lodash');

function getSelectionModeByEvent(event) {
	if (event.shiftKey) {
		return 'region';
	}

	if (_.some([event.ctrlKey, event.metaKey, event.altKey])) {
		return 'toggle';
	}

	return 'single';
}

module.exports = getSelectionModeByEvent;
