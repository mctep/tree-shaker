/* eslint-env browser */
const NodeObservable = require('./node-observable');
const NodeElement = require('./node-element');

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

module.exports = class TreeElement {
	constructor(options) {
		this.handleNodesUpdate = this.handleNodesUpdate.bind(this);
		this.handleClick = this.handleClick.bind(this);

		this.element = document.createElement('div');
		this.element.addEventListener('click', this.handleClick);

		const { nodes } = options;

		this.nodeElements = [];

		this.unsubscribe = nodes.subscribe(this.handleNodesUpdate);
		this.handleNodesUpdate(nodes.state);
	}

	dispose() {
		this.unsubsciribe();
	}

	handleNodesUpdate(nodes) {
		this.nodeElements.forEach((nodeElement) => {
			nodeElement.dispose();
			this.element.removeChild(nodeElement.element);
		});

		this.nodeObservables = {};

		this.nodeElements = nodes.list.map((node) => {
			const { id } = node;
			const nodeObservable = new NodeObservable(node);

			this.nodeObservables[id] = nodeObservable;

			const nodeElement = new NodeElement(nodeObservable);

			this.element.appendChild(nodeElement.element);

			return nodeElement;
		});
	}

	handleClick(event) {
		const { target } = event;

		const nodeDomElement = findClosestNodeElement(target);

		if (!nodeDomElement) {
			return;
		}

		const id = getNodeId(nodeDomElement);

		if (!id) {
			return;
		}

		this.nodeObservables[id].toggleSelect();
	}

	render() {
		this.list.items.forEach((node) => {
			const nodeElement = new NodeElement(node);

			this.element.appendChild(nodeElement.element);
		});
	}
};
