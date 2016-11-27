const Component = require('./component');

function getParentCount(node) {
	let result = 0;
	let parent = node.parent;

	while (parent) {
		result += 1;
		parent = parent.parent;
	}

	return result;
}

function renderTitle(node, state = {}) {
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

class AvailableNode extends Component {
	constructor(options) {
		super();

		this.node = options.node;
		this.render();
	}

	render(state) {
		const node = this.node;

		this.element.innerHTML = renderTitle(node, state);
	}
}

module.exports = AvailableNode;
