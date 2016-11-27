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

function getParentCount(node) {
	let result = 0;
	let parent = node.parent;

	while (parent) {
		result += 1;
		parent = parent.parent;
	}

	return result;
}

function renderNodeTitle(node, state = {}) {
	const { selected } = state;
	const { id, title } = node;

	let parentCount = getParentCount(node);
	let padding = '';

	while (parentCount) {
		padding += '&nbsp;';
		parentCount -= 1;
	}

	const bullet = selected
		? '&bullet; '
		: '';

	return `${padding}#${id} ${bullet}${title}`;
}


class AvailableListView {
	constructor() {
		this.handleClick = this.handleClick.bind(this);
		const element = this.element = document.createElement('div');

		element.addEventListener('click', this.handleClick);
	}

	handleClick(event) {
		const id = getNodeIdByElement(event.target);

		if (!id) {
			return;
		}

		if (!this.onSelect) {
			return;
		}

		this.onSelect(id);
	}

	getElementByNode(node) {
		return this.element.querySelector(`div[data-node="${node.id}"]`);
	}

	select(node) {
		const element = this.getElementByNode(node);

		if (!element) {
			return;
		}

		element.innerHTML = renderNodeTitle(node, { selected: true });
	}

	deselect(node) {
		const element = this.getElementByNode(node);

		if (!element) {
			return;
		}

		element.innerHTML = renderNodeTitle(node, { selected: false });
	}

	deselectMany(nodes) {
		nodes.forEach((node) => {
			this.deselect(node);
		});
	}

	renderNodes(list) {
		const html = list.map((node) => {
			const title = renderNodeTitle(node);

			return `<div data-node=${node.id}>${title}</div>`;
		}).join('');

		this.element.innerHTML = html;
	}
}

module.exports = AvailableListView;
