const _ = require('lodash');
const $ = require('jquery');
const classNames = require('./styles');
const Tree = require('tree-shaker/lib/tree');
const cn = require('tree-shaker/lib/classnames');
const escapeHtml = require('tree-shaker/lib/escape-html');

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
		<button class="${cn(classNames.button.button, className)}">
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
			class="${cn(classNames.filter.input, className)}"
			type="text"
		/>
	`;
}

const templates = {
	available: {
		getElement(option) {
			const { data } = option;
			const name = escapeHtml(data.name);
			const pad = getPad(option);

			return $(`<div title="${name}">${pad} ${name}</div>`);
		},

		updateElement(option, $element) {
			const { data } = option;
			const name = escapeHtml(data.name);
			const pad = getPad(option);

			return $element.html(`<div title="${name}">${pad} ${name}</div>`);
		},
	},

	chosen: {
		getElement(option) {
			const { data } = option.data.availableNode;
			const name = escapeHtml(data.name);
			const pad = getPad(option);

			return $(`<div title="${name}">${pad} ${name}</div>`);
		},

		updateElement(option, $element) {
			const { data } = option.data.availableNode;
			const name = escapeHtml(data.name);
			const pad = getPad(option);

			return $element.html(`<div title="${name}">${pad} ${name}</div>`);
		},
	},

	inputFilter: {
		getElement() {
			return $(`
				<input
					placeholder="Filter"
					class="${classNames.filter.input}"
					type="text"
				/>
			`);
		},
	},

	moveDownButton: {
		getElement() {
			return $(getButtonHtml({
				children: '↓',
				className: classNames.buttonsSort.button,
			}));
		},
	},

	moveToChosenButton: {
		getElement() {
			return $(getButtonHtml({
				children: '→',
				className: classNames.buttonsMove.button,
			}));
		},
	},

	moveUpButton: {
		getElement() {
			return $(getButtonHtml({
				children: '↑',
				className: classNames.buttonsSort.button,
			}));
		},
	},

	removeFromChosenButton: {
		getElement() {
			return $(getButtonHtml({
				children: '←',
				className: classNames.buttonsMove.button,
			}));
		},
	},
};


module.exports = {
	classNames,
	getButtonHtml,
	getInputHtml,
	templates,
};
