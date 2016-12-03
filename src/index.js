const $ = require('jquery');
const _ = require('lodash');
const ArrayObservable = require('lib/array-ovservable');
const getTeamcityProjects = require('lib/get-teamcity-projects');
const Tree = require('lib/tree');
const TreeShaker = require('tree-shaker');


// eslint-disable-next-line import/no-unassigned-import
require('./style.css');

const nodesObservable = new ArrayObservable([]);

function availableOptionTemplate(option) {
	const { data } = option;
	const ancestors = Tree.getAncestors(option);

	ancestors.shift();
	const pad = _.map(ancestors, () => {
		return '&nbsp;&nbsp;';
	}).join('');

	return `${pad}${data.name}`;
}

function chosenOptionTemplate(option) {
	const { data } = option.data.availableNode;
	const ancestors = Tree.getAncestors(option);

	ancestors.shift();
	const pad = _.map(ancestors, () => {
		return '&nbsp;';
	}).join('');

	return `${pad}${data.name}`;
}

const treeShaker = new TreeShaker({
	availableOptionTemplate,
	chosenOptionTemplate,
	nodesObservable,
});


$('#example').append(treeShaker.$element);

getTeamcityProjects((nodes) => {
	nodesObservable.set(nodes);
});
