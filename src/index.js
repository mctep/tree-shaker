const $ = require('jquery');
const _ = require('lodash');

const styles = require('./styles');

const ArrayObservable = require('lib/array-ovservable');
const getTeamcityProjects = require('lib/get-teamcity-projects');
const Tree = require('lib/tree');
const cn = require('lib/classnames');
const TreeShaker = require('tree-shaker');

const nodesObservable = new ArrayObservable([]);

function getPad(option) {
	const ancestors = Tree.getAncestors(option);

	ancestors.shift();

	return _.map(ancestors, () => {
		return '&nbsp;&nbsp;';
	}).join('');
}

const availableTemplates = {
	getElement(option) {
		const { data } = option;
		const pad = getPad(option);

		return $(`<div>${pad} ${data.name}</div>`);
	},

	// getShadowElement(option) {
	// 	const pad = getPad(option);
	//
	// 	return $(`<div>${pad}.......</div>`);
	// },

	updateElement(option, $element) {
		const { data } = option;
		const pad = getPad(option);

		return $element.html(`<div>${pad} ${data.name}</div>`);
	},
};

const chosenTemplates = {
	getElement(option) {
		const { data } = option.data.availableNode;
		const pad = getPad(option);

		return $(`<div>${pad} ${data.name}</div>`);
	},

	// getShadowElement(option) {
	// 	const pad = getPad(option);
	//
	// 	return $(`<div>${pad}.......</div>`);
	// },

	updateElement(option, $element) {
		const { data } = option.data.availableNode;
		const pad = getPad(option);

		return $element.html(`<div>${pad} ${data.name}</div>`);
	},
};

function getButtonHtml(content, className) {
	return `
		<button class="${cn(styles.button.button, className)}">
			<span class=${styles.button.content}>
				${content}
			</span>
		</button>
	`;
}

const templates = {
	available: availableTemplates,
	chosen: chosenTemplates,

	inputFilter: {
		getElement() {
			return $(`<input class="${styles.inputFilter}" type="text"/>`);
		},
	},

	moveDownButton: {
		getElement() {
			return $(getButtonHtml('down'));
		},
	},

	moveToChosenButton: {
		getElement() {
			return $(getButtonHtml('-&gt;', styles.buttonsMove.button));
		},
	},

	moveUpButton: {
		getElement() {
			return $(getButtonHtml('up'));
		},
	},

	removeFromChosenButton: {
		getElement() {
			return $(getButtonHtml('&lt;-', styles.buttonsMove.button));
		},
	},

};

const treeShaker = new TreeShaker({
	classNames: styles,
	nodesObservable,
	templates,
});


$('#example').append(treeShaker.$element);

getTeamcityProjects((nodes) => {
	nodesObservable.set(nodes);
});
