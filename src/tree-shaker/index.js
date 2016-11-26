import Store from 'tree-shaker/lib/store';
import Tree from 'tree-shaker/lib/tree-element';
import denormalize from 'tree-shaker/lib/denormalize';

export default class TreeShaker {
	constructor(container, options) {
		const { nodesStore } = options;

		this.container = container;

		this.allNodesTree = new Tree({ store: nodesStore });
		this.container.appendChild(this.allNodesTree.element);
	}
}

export { Store, denormalize };
