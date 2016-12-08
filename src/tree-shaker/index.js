const TreeShakerPrivateApi = require('./tree-shaker-private-api');
const Tree = require('./lib/tree');
const pickChosenNodesFromAvailable =
require('./lib/pick-chosen-nodes-from-available');

class TreeShaker extends TreeShakerPrivateApi {
	constructor(props) {
		const superProps = {};

		superProps.templates = props.templates;
		superProps.classNames = props.classNames;
		super(superProps);
	}

	setNodes(nodes) {
		this.availableTree = new Tree(nodes);
		this.chosenTree = new Tree([]);
	}

	setChosenNodes(nodes) {
		const existsNodes = pickChosenNodesFromAvailable(
			nodes, this.availableTree
		);

		this.chosenTree = new Tree(existsNodes);
		this.handleChosenNodesChange();
	}

	onChosenNodesChange(callback) {
		// just single callback
		// of course it can be obeservable or event emmiter
		// in the future :)
		this.onChosenNodesChangeListener = callback;
	}

	offChosenNodesChange() {
		delete this.onChosenNodesChangeListener;
	}

	updateHeight() {
		this.availableSelect.updateHeight();
		this.chosenSelect.updateHeight();
	}

	refresh() {
		super.refresh();
	}
}

TreeShaker.Tree = Tree;

module.exports = TreeShaker;
