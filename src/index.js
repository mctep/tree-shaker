const $ = require('jquery');

const ArrayObservable = require('lib/array-ovservable');
const getTeamcityProjects = require('lib/get-teamcity-projects');
const TreeShaker = require('tree-shaker');
const { classNames, templates } = require('tree-shaker/default-theme');

const nodesObservable = new ArrayObservable([]);

const treeShaker = new TreeShaker({
	classNames,
	nodesObservable,
	templates,
});

$('#example').append(treeShaker.$element);

treeShaker.updateHeight();

getTeamcityProjects((nodes) => {
	nodesObservable.set(nodes);
});
