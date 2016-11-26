/* eslint-env browser */
const NODE_ATTRIBUTE = 'data-node';
const STEP = 1;

function getParentCount(node) {
	let result = 0;
	let parent = node.parent;

	while (parent) {
		result += STEP;
		parent = parent.parent;
	}

	return result;
}

function renderNodeTitle(node) {
	const { id, selected } = node;

	let parentCount = getParentCount(node);
	let padding = '';

	while (parentCount) {
		padding += '&nbsp;';
		parentCount -= STEP;
	}

	const title = selected
		? 'Selected Node'
		: 'Node';

	return `<p>${padding}${title} #${id}</p>`;
}

class NodeElement {
	constructor(nodeObservable) {
		this.handleNodeUpdate = this.handleNodeUpdate.bind(this);

		const { state } = nodeObservable;
		const element = this.element = document.createElement('div');

		element.setAttribute(NODE_ATTRIBUTE, state.id);

		this.unsubscribe = nodeObservable.subscribe(this.handleNodeUpdate);
		this.render(nodeObservable.state);
	}

	handleNodeUpdate(node) {
		this.render(node);
	}

	dispose() {
		this.unsubscribe();
	}

	render(node) {
		this.element.innerHTML = renderNodeTitle(node);
	}
}


module.exports = NodeElement;
