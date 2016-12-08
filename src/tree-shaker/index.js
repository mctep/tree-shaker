const TreeShakerPrivateApi = require('./tree-shaker-private-api');
const Tree = require('./lib/tree');
const pickChosenNodesFromAvailable =
require('./lib/pick-chosen-nodes-from-available');

class TreeShaker extends TreeShakerPrivateApi {
	/**
	 * Tree Shaker operates with two trees. Available and Chosen.
	 * User selects nodes or subtrees and moves it from one tree to another.
	 * You can customize DOM elements by passing templates and classNames
	 * options to constructor.
	 *
	 *
	 * @param {Object} props TreeShaker options
	 * @param {Object} props.templates Templates for TreeShaker elements
	 * @param {Object} props.classNames Class names for TreeShaker elements
	 * @return {TreeShaker} TreeShaker instance
	 */
	constructor(props) {
		const superProps = {};

		superProps.templates = props.templates;
		superProps.classNames = props.classNames;

		super(superProps);

		/**
		 * jQuery DOM Element of Tree Shaker Component.
		 * Apply it where you need.
		 * @type {jQueryObject}
		 */
		this.$element = this.$element;
	}

	/**
	 * Sets available tree from deserialized list of nodes.
	 * Deserialized nodes must have at least two properties `id` and `parentId`.
	 * It is enought to make full tree. Original input node object
	 * sets to serializedNode.data.
	 *
	 * ```
	 * { id: 1, parentId: 1, name: 'foo' }
	 *   serialized to
	 * { id: 1, data: { id: 1, parentId, name: 'foo' },
	 *   ...(other node relations props) }
	 * ```
	 *
	 * @memberof TreeShaker
	 * @param {Object[]} nodes deserialized list of nodes
	 * @returns {void}
	 */
	setNodes(nodes) {
		this.availableTree = new Tree(nodes);
		this.chosenTree = new Tree([]);
		this.$filterInput.val('');
	}

	/**
	 * Sets chosen tree from deserialized list of nodes
	 *
	 * @param {Object[]} nodes deserialized list of nodes
	 * @returns {void}
	 */
	setChosenNodes(nodes) {
		const existsNodes = pickChosenNodesFromAvailable(
			nodes, this.availableTree
		);

		this.chosenTree = new Tree(existsNodes);
		this.handleChosenNodesChange();
	}

	/**
	 * Sets a listener for changing or reordering chosen nodes.
	 * You can use it for saving Tree Shaker state to your storage
	 *
	 * @param {function} callback listener
	 * @returns {void}
	 */
	onChosenNodesChange(callback) {
		// just single callback
		// of course it can be obeservable or event emmiter
		// in the future :)
		this.onChosenNodesChangeListener = callback;
	}

	/**
	 * Remove listener
	 * @returns {void}
	 */
	offChosenNodesChange() {
		delete this.onChosenNodesChangeListener;
	}

	/**
	 * Order TreeShaker to update its height. Tree shaker uses virtual scrolling
	 * and does not subscribe to `onresize` events or other stuff that can change
	 * is height. So you should call this method by yourself when you need.
	 * After applying TreeShaker $element you must call this method
	 * for update selects height.
	 * @returns {void}
	 */
	updateHeight() {
		this.availableSelect.updateHeight();
		this.chosenSelect.updateHeight();
	}

	/**
	 * Refresh all TreeShaker elements with current trees states.
	 * Call this method when you change any of the trees
	 * with `setNodes` or `setChosenNodes` methods.
	 *
	 * @example
	 * treeShaker.setNodes(availableNodes);
	 * treeShaker.setChosenNodes(chosenNodes);
	 * treeShaker.refresh();
	 *
	 * @returns {void}
	 */
	refresh() {
		super.refresh();
	}
}

TreeShaker.Tree = Tree;

module.exports = TreeShaker;
