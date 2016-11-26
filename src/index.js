/* eslint-env browser */
import TreeShaker, { Store, denormalize } from 'tree-shaker';

const exampleDOMElement = document.getElementById('example');

const nodes = denormalize([{
	id: '1',
	parentId: null,
}, {
	id: '2',
	parentId: '1',
}, {
	id: '3',
	parentId: null,
}, {
	id: '4',
	parentId: '2',
}]);

const nodesStore = new Store(() => {
	return nodes;
});

const treeShaker = new TreeShaker(exampleDOMElement, {
	nodesStore,
});

treeShaker.toString();
