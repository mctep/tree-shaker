/* eslint-env browser */
const Component = require('./component');

const NODE_ATTRIBUTE = 'data-node';

// function getParentCount(node) {
// 	let result = 0;
// 	let parent = node.parent;
//
// 	while (parent) {
// 		result += STEP;
// 		parent = parent.parent;
// 	}
//
// 	return result;
// }

function renderNodeTitle(state) {
	const { selected } = state;
	const { id, title } = state.node;

	// let parentCount = getParentCount(state);
	const padding = '';

	// while (parentCount) {
	// 	padding += '&nbsp;';
	// 	parentCount -= STEP;
	// }

	const bullet = selected
		? '&bullet; '
		: '';

	return `${padding}#${id} ${bullet}${title}`;
}

class NodeElement extends Component {
	createElement() {
		this.element = document.createElement('div');
	}

	render(state) {
		this.element.setAttribute(NODE_ATTRIBUTE, state.id);
		this.element.innerHTML = renderNodeTitle(state);
	}
}


module.exports = NodeElement;
