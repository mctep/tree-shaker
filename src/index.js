/* eslint-env browser */
import TreeShaker, { Observable } from 'tree-shaker';

const exampleDOMElement = document.getElementById('example');

const nodes = [{
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
}];

const nodesObservable = new Observable(nodes);

const treeShaker = new TreeShaker(exampleDOMElement, {
	nodes: nodesObservable,
});

treeShaker.toString();
