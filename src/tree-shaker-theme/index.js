const _ = require('lodash');
const $ = require('jquery');
const classNames = require('./styles');
const cn = require('./lib/classnames');
const escapeHtml = require('./lib/escape-html');
const chosenOption = require('./chosen-option');

const { Tree } = require('tree-shaker');

function getPad(option) {
	const ancestors = Tree.getAncestors(option);

	ancestors.shift();

	return _.map(ancestors, () => {
		return '&nbsp;&nbsp;';
	}).join('');
}

function getButtonHtml(props) {
	const { className, children } = props;

	return `
		<button type="button" class="${cn(classNames.button.button, className)}">
			<span class=${classNames.button.content}>
				${escapeHtml(children)}
			</span>
		</button>
	`;
}

function getInputHtml(props) {
	const { className, placeholder } = props;

	return `
		<input
			placeholder="${escapeHtml(placeholder)}"
			class="${cn(classNames.input, className)}"
			type="text"
		/>
	`;
}

const templates = {
	availableOption: (option) => {
		const { name } = option.data;

		const $pad = $('<span></span>').html(getPad(option));

		return $('<div></div>')
		.attr('title', name)
		.text(name)
		.prepend($pad)
		.data('update', (updatedOption) => {
			$pad.html(getPad(updatedOption));
		});
	},

	chosenOption,

	inputFilter: () => {
		return $(getInputHtml({
			className: classNames.filter.input,
			placeholder: 'Filter',
		}));
	},

	moveDownButton: () => {
		return $(getButtonHtml({
			children: '↓',
			className: classNames.buttonsSort.button,
		}));
	},

	moveToChosenButton: () => {
		return $(getButtonHtml({
			children: '→',
			className: classNames.buttonsMove.button,
		}));
	},

	moveUpButton: () => {
		return $(getButtonHtml({
			children: '↑',
			className: classNames.buttonsSort.button,
		}));
	},

	removeFromChosenButton: () => {
		return $(getButtonHtml({
			children: '←',
			className: classNames.buttonsMove.button,
		}));
	},
};


module.exports = {
	classNames,
	getButtonHtml,
	getInputHtml,
	templates,
};
