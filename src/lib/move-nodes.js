const _ = require('lodash');

function moveSelectedNodesToChosen(props) {
	const {
		currentChosenIds,
		selectedIds,
		currentAvailableDisabledIds,
	} = props;

	const availableSelectedIds = [];
	const availableDisabledIds = _.uniq(
		currentAvailableDisabledIds.concat(selectedIds)
	);

	const chosenIds = _.uniq(currentChosenIds.concat(selectedIds));
	const chosenSelectedIds = selectedIds;

	return {
		availableDisabledIds,
		availableSelectedIds,
		chosenIds,
		chosenSelectedIds,
	};
}

function removeSelectedNodesFromChosen(props) {
	const chosen = _.without(props.chosen, ...props.chosenSelected);
	const chosenSelected = [];
	const availableSelected = props.chosenSelected;
	const availableDisabled = _.without(
		props.availableDisabled, ...props.chosenSelected
	);

	return {
		availableDisabled,
		availableSelected,
		chosen,
		chosenSelected,
	};
}

module.exports = {
	moveSelectedNodesToChosen,
	removeSelectedNodesFromChosen,
};
