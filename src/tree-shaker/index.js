import Observable from 'tree-shaker/lib/observable';
import Tree from 'tree-shaker/lib/tree-element';
import normalize from 'tree-shaker/lib/normalize';

export default class TreeShaker {
	constructor(container, options) {
		const { nodes } = options;

		this.nodes = new Observable(normalize(nodes.state));

		nodes.subscribe((state) => {
			this.nodes.setState(normalize(state));
		});

		this.container = container;

		this.allNodesTree = new Tree({ nodes: this.nodes });

		this.container.appendChild(this.allNodesTree.element);
	}
}

export { Observable };
