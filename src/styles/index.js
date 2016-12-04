/* eslint import/no-unassigned-import:off */
require('./normalize.css');
require('./style.css');
require('./select.css');
require('./button.css');
require('./buttons-move.css');

module.exports = {
	button: {
		button: 'ts-button',
		content: 'ts-button-content',
	},

	buttonsMove: {
		button: 'ts-button-move',
		container: 'ts-buttons-move',
	},

	buttonsSort: 'ts-buttons-sort',

	container: 'ts-container',

	inputFilter: 'ts-input-filter',

	select: {
		disabled: 'ts-disabled',
		option: 'ts-option',
		select: 'ts-select',
		selected: 'ts-selected',
	},

	selectAvailable: 'ts-select-available',
	selectChosen: 'ts-select-chosen',
};
