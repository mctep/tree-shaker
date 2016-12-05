/* eslint import/no-unassigned-import:off */
require('./normalize.css');
require('./select.css');
require('./input.css');
require('./button.css');
require('./buttons.css');
require('./style.css');
require('./ancestors.css');

module.exports = {
	button: {
		button: 'ts-button',
		content: 'ts-button-content',
	},

	buttonsMove: {
		button: 'ts-button-move',
		container: 'ts-buttons',
		content: 'ts-buttons-content',
	},

	buttonsSort: {
		button: 'ts-button-sort',
		container: 'ts-buttons',
		content: 'ts-buttons-content',
	},

	columnAvailable: 'ts-column ts-column-available',
	columnChosen: 'ts-column ts-column-chosen',

	container: 'ts-container',

	filter: {
		container: 'ts-filter-container',
		input: 'ts-filter-input',
	},

	input: 'ts-input',

	select: {
		disabled: 'ts-disabled',
		option: 'ts-option',
		select: 'ts-select',
		selected: 'ts-selected',
	},

	selectAvailable: 'ts-select-available',
	selectChosen: 'ts-select-chosen',
};
