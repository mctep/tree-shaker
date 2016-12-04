const _ = require('lodash');
const $ = require('jquery');
const classNames = require('./styles');
const Tree = require('lib/tree');
const cn = require('lib/classnames');
const escapeHtml = require('lib/escape-html');

function getPad(option) {
	const ancestors = Tree.getAncestors(option);

	ancestors.shift();

	return _.map(ancestors, () => {
		return '&nbsp;&nbsp;';
	}).join('');
}

function getButtonHtml(content, className) {
	return `
		<button class="${cn(classNames.button.button, className)}">
			<span class=${classNames.button.content}>
				${content}
			</span>
		</button>
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

		// getShadowElement(option) {
		// 	const pad = getPad(option);
		//
		// 	return $(`<div>${pad}.......</div>`);
		// },

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

		// getShadowElement(option) {
		// 	const pad = getPad(option);
		//
		// 	return $(`<div>${pad}.......</div>`);
		// },

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
			return $(getButtonHtml('↓', classNames.buttonsSort.button));
		},
	},

	moveToChosenButton: {
		getElement() {
			return $(getButtonHtml('→', classNames.buttonsMove.button));
		},
	},

	moveUpButton: {
		getElement() {
			return $(getButtonHtml('↑', classNames.buttonsSort.button));
		},
	},

	removeFromChosenButton: {
		getElement() {
			return $(getButtonHtml('←', classNames.buttonsMove.button));
		},
	},
};


module.exports = {
	classNames,
	templates,
};
