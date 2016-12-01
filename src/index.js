const $ = require('jquery');
const generateRandomNodes = require('lib/generate-random-nodes');
const ArrayObservable = require('lib/array-ovservable');
const TreeShaker = require('tree-shaker');

// eslint-disable-next-line import/no-unassigned-import
require('./style.css');

const MAX_COUNT = 100;

function getCount() {
	return Math.ceil(Math.random() * MAX_COUNT);

	// return MAX_COUNT;
}

const nodesObservable = new ArrayObservable([]);

const treeShaker = new TreeShaker({
	nodesObservable,
});


$('#example')
.append(treeShaker.$element)
.append(
	$('<button type="button">toggle</button>')
	.on('click', () => {
		nodesObservable.set(generateRandomNodes(getCount()));
	})
);
