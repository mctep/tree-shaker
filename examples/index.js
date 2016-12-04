const $ = require('jquery');

const getTeamcityProjects = require('./get-teamcity-projects');
const generateRandomNodes = require('./generate-random-nodes');

const { classNames, templates } = require('tree-shaker-theme');
const TreeShaker = require('tree-shaker');

// eslint-disable-next-line import/no-unassigned-import
require('./style.css');

const treeShaker = new TreeShaker({ classNames, templates });

$('#tree-shaker').append(treeShaker.$element);

treeShaker.updateHeight();

$('.example-button-teamcity').click(() => {
	getTeamcityProjects((nodes) => {
		treeShaker.setNodes(nodes);
	});
});

$('.example-button-have-fun').click(() => {
	const value = $('.example-input-count').val();
	const count = parseInt(value.replace(/K/g, '000'), 10);

	if (count > 0) {
		treeShaker.setNodes(generateRandomNodes(count));
	}
});
