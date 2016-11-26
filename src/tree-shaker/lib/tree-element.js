/* eslint-env browser */
const denormalize = require('./denormalize');

function renderNodeTitle(node) {
	const { id } = node;

	return `<p>Node #${id}</p>`;
}

function renderNodeNested(node) {
	const { children } = node;
	const nested = children.length
		? children.map(renderNode)
		: '';

	return nested && `<ul>${nested}</ul>`;
}

function renderNode(node) {
	const { id } = node;
	const nodeTitle = renderNodeTitle(node);
	const nodeNested = renderNodeNested(node);

	return `<li data-node=${id}>${nodeTitle}${nodeNested}</li>`;
}

module.exports = class TreeElement {
	constructor(options) {
		const { store } = options;

		this.store = store;
		this.element = document.createElement('ul');
		this.handleStoreUpdate = this.handleStoreUpdate.bind(this);
		this.unsubsciribe = store.subscribe(this.handleStoreUpdate);
		this.render();
	}

	dispose() {
		this.unsubsciribe();
	}

	handleStoreUpdate() {
		this.render();
	}

	render() {
		const nodes = this.store.getState();
		const rootNode = nodes[denormalize.root];

		const html = rootNode.children.map(renderNode).join('');

		this.element.innerHTML = html;
	}
};
