const $ = require('jquery');
const _ = require('lodash');
const ArrayObservable = require('lib/array-ovservable');
const getTeamcityProjects = require('lib/get-teamcity-projects');
const Tree = require('lib/tree');
const TreeShaker = require('tree-shaker');


// eslint-disable-next-line import/no-unassigned-import
require('./style.css');

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

	getShadowElement(option) {
		const pad = getPad(option);

		return $(`<div>${pad}.......</div>`);
	},

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

	getShadowElement(option) {
		const pad = getPad(option);

		return $(`<div>${pad}.......</div>`);
	},

	updateElement(option, $element) {
		const { data } = option.data.availableNode;
		const pad = getPad(option);

		return $element.html(`<div>${pad} ${data.name}</div>`);
	},
};

const treeShaker = new TreeShaker({
	availableTemplates,
	chosenTemplates,
	nodesObservable,
});


$('#example').append(treeShaker.$element);

getTeamcityProjects((nodes) => {
	nodesObservable.set(nodes);
});
