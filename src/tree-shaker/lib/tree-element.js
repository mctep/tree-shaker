/* eslint-env browser */
const NodeElement = require('./node-element');
const Component = require('./component');

const NODE_ATTRIBUTE = 'data-node';

function getNodeId(element) {
	return element.getAttribute(NODE_ATTRIBUTE);
}

function findClosestNodeElement(element) {
	let parent = element;

	do {
		if (getNodeId(parent)) {
			return parent;
		}
		parent = parent.parentElement;
	} while (parent);

	return null;
}

function getNodeIdByElement(target) {
	const element = findClosestNodeElement(target);

	if (!element) {
		return null;
	}

	return getNodeId(element);
}

class Tree extends Component {
	createElement() {
		this.element = document.createElement('div');
		this.handleClick = this.handleClick.bind(this);
		this.element.addEventListener('click', this.handleClick);
		this.list = [];
	}

	dispose() {
		super.dispose();
		this.element.removeListener(this.handleClick);
	}

	removeNodeComponent(nodeComponent) {
		this.element.removeChild(nodeComponent.element);
		nodeComponent.dispose();
	}

	addNodeComponent(node) {
		const { id } = node;

		const nodeComponent = new NodeElement(this.store, (state) => {
			return {
				node,
				selected: state.selectedIds.includes(id),
			};
		});

		this.list.push(nodeComponent);
		this.element.appendChild(nodeComponent.element);
	}

	handleClick(event) {
		const id = getNodeIdByElement(event.target);

		if (!id) {
			return;
		}

		const { state } = this.store;
		let { selectedIds } = state;

		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((selectedId) => {
				return selectedId !== id;
			});
		} else {
			selectedIds.push(id);
		}

		state.selectedIds = selectedIds;
		this.store.dispatch(state);
	}

	render(state) {
		this.list.forEach(this.removeNodeComponent.bind(this));
		state.list.forEach(this.addNodeComponent.bind(this));
	}
}

module.exports = Tree;

// module.exports = class TreeElement {
// 	constructor(options) {
// 		this.options = options;
// 		this.handleNodesUpdate = this.handleNodesUpdate.bind(this);
// 		this.handleClick = this.handleClick.bind(this);
//
// 		this.element = document.createElement('div');
// 		this.element.addEventListener('click', this.handleClick);
//
// 		const { nodes } = options;
//
// 		this.nodeElements = [];
//
// 		this.unsubscribe = nodes.subscribe(this.handleNodesUpdate);
// 		this.handleNodesUpdate(nodes.state);
// 	}
//
// 	dispose() {
// 		this.unsubsciribe();
// 	}
//
// 	handleNodesUpdate(nodes) {
// 		this.nodeElements.forEach((nodeElement) => {
// 			nodeElement.dispose();
// 			this.element.removeChild(nodeElement.element);
// 		});
//
// 		this.nodeObservables = {};
//
// 		this.nodeElements = nodes.list.map((node) => {
// 			const { id } = node;
// 			const nodeObservable = new NodeObservable(node);
//
// 			this.nodeObservables[id] = nodeObservable;
//
// 			const nodeElement = new NodeElement(nodeObservable);
//
// 			this.element.appendChild(nodeElement.element);
// 			nodeElement.element.className = this.options.nodeClassName;
//
// 			return nodeElement;
// 		});
// 	}
//
// 	handleClick(event) {
// 		const { target } = event;
//
// 		const nodeDomElement = findClosestNodeElement(target);
//
// 		if (!nodeDomElement) {
// 			return;
// 		}
//
// 		const id = getNodeId(nodeDomElement);
//
// 		if (!id) {
// 			return;
// 		}
//
//
// 		const node = this.nodeObservables[id];
//
// 		node.toggleSelect();
//
// 		const { selected } = node.state;
// 		let selectedIds = this.options.selectedIds.state;
//
// 		if (selected) {
// 			selectedIds.push(id);
// 		} else {
// 			selectedIds = selectedIds.filter((selectedId) => {
// 				return selectedId !== id;
// 			});
// 		}
//
// 		this.options.selectedIds.setState(selectedIds);
// 	}
// };
