const $ = require('jquery');

const getTeamcityProjects = require('./get-teamcity-projects');
const generateRandomNodes = require('./generate-random-nodes');

const ArrayObservable = require('tree-shaker/lib/array-ovservable');

const {
	classNames,
	templates,
	getButtonHtml,
	getInputHtml,
} = require('tree-shaker/default-theme');
const TreeShaker = require('tree-shaker');

// eslint-disable-next-line import/no-unassigned-import
require('./style.css');

const nodesObservable = new ArrayObservable([]);

const treeShaker = new TreeShaker({
	classNames,
	nodesObservable,
	templates,
});

const $form = $(`
	<form class="example-form">
		<h1>Tree Shaker Demo</h1>
		<div>
			${getButtonHtml({
				children: 'Get mocked Teamcity Projects',
				className: 'example-button-teamcity',
			})}
			or set random
			${getInputHtml({
				className: 'example-input-count',
				placeholder: 'count',
			})}
			nodes and
			${getButtonHtml({
				children: 'Have fun',
				className: 'example-button-have-fun',
			})}
		</div>
		<br/>
		<h2 class="example-column">Available nodes:</h2><h2 class="example-column">
			Chosen nodes:
		</h2>
		<div id="tree-shaker" class="example-container"></div>
	</form>
`);

$('#example').append($form);
$('#tree-shaker').append(treeShaker.$element);

treeShaker.updateHeight();

$('.example-button-teamcity').click(() => {
	getTeamcityProjects((nodes) => {
		nodesObservable.set(nodes);
	});
});

$('.example-button-have-fun').click(() => {
	const count = parseInt($('.example-input-count').val(), 10);

	if (count > 0) {
		nodesObservable.set(generateRandomNodes(count));
	}
});
