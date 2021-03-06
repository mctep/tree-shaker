const $ = require('jquery');
const getTeamcityProjects = require('./get-teamcity-projects');
const generateRandomNodes = require('./generate-random-nodes');
const storage = require('./storage');
const TreeShaker = require('tree-shaker');
const { classNames, templates, optionHeight } = require('tree-shaker-theme');

require('./style.css'); // eslint-disable-line import/no-unassigned-import

const treeShaker = new TreeShaker({ classNames, optionHeight, templates });

$('#tree-shaker').append(treeShaker.$element);
treeShaker.updateHeight();
loadTeamcityNodes();

$('.example-button-teamcity').click(loadTeamcityNodes);

// load random nodes
$('.example-button-have-fun').click(() => {
	const value = $('.example-input-count').val();
	const count = parseInt(value.replace(/K/g, '000'), 10);

	if (count > 0) {
		treeShaker.offChosenNodesChange();
		treeShaker.setNodes(generateRandomNodes(count));
		treeShaker.refresh();
	}
});

function getStoredChosenNodes() {
	try {
		return JSON.parse(storage.getItem('chosen-nodes'));
	} catch (err) {
		return null;
	}
}

function loadTeamcityNodes() {
	const storedChosenNodes = getStoredChosenNodes();

	getTeamcityProjects((nodes) => {
		treeShaker.setNodes(nodes);
		if (storedChosenNodes) {
			treeShaker.setChosenNodes(storedChosenNodes);
		}

		treeShaker.onChosenNodesChange((chosenNodes) => {
			storage.setItem('chosen-nodes', JSON.stringify(chosenNodes));
		});

		treeShaker.refresh();
	});
}
