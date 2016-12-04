const $ = require('jquery');

const ArrayObservable = require('tree-shaker/lib/array-ovservable');
const getTeamcityProjects = require('tree-shaker/lib/get-teamcity-projects');
const TreeShaker = require('tree-shaker');

const {
	classNames,
	templates,
} = require('tree-shaker/default-theme');

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
