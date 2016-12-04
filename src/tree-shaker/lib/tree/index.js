const getAncestors = require('./get-ancestors');
const getNearestAncestorWithNext = require('./get-nearest-ancestor-with-next');
const getChildren = require('./get-children');
const toList = require('./to-list');
const findFirst = require('./find-first');
const moveNodeUp = require('./move-node-up');
const moveNodeDown = require('./move-node-down');
const filterWithAncestors = require('./filter-with-ancestors');
const forEach = require('./for-each');

class Tree {
	static createEmptyNode(id) {
		return {
			first: null,
			id,
			last: null,
			next: null,
			parent: null,
			prev: null,
		};
	}

	constructor(nodes) {
		this.rootNode = Tree.createEmptyNode('root');
		this.index = {};

		if (nodes) {
			const length = nodes.length;

			for (let idx = 0; idx < length; idx += 1) {
				this.addRawNode(nodes[idx]);
			}
		}
	}

	getNodeById(id) {
		return this.index[id];
	}

	// eslint-disable-next-line complexity
	removeNode(node) {
		const { id, parent, prev, next } = node;

		if (!prev && parent) {
			parent.first = next;
		}

		if (!next && parent) {
			parent.last = prev;
		}

		if (next) {
			next.prev = prev;
		}

		if (prev) {
			prev.next = next;
		}

		node.next = null;
		node.prev = null;
		node.parent = null;

		delete this.index[id];
	}

	moveNodeToParent(node, parent) {
		if (node.parent === parent) {
			return;
		}

		this.removeNode(node);

		node.parent = parent;

		const { last } = parent;

		if (last) {
			last.next = node;
			node.prev = last;
			parent.last = node;
		} else {
			parent.first = node;
			parent.last = node;
		}

		this.index[node.id] = node;
	}

	addRawNode(rawNode) {
		const { id, parentId } = rawNode;

		const node = this.getNodeById(id) || Tree.createEmptyNode(id);

		const parent = parentId && (this.getNodeById(parentId) ||
			this.addRawNode({ id: parentId }));

		if (parent) {
			this.moveNodeToParent(node, parent);
		} else {
			this.moveNodeToParent(node, this.rootNode);
		}

		this.index[id] = node;
		node.data = rawNode;

		return node;
	}

	toList() {
		return Tree.toList(this.rootNode);
	}

	getAncestors(node) {
		return Tree.getAncestors(node, this.rootNode);
	}

	findFirst(checker) {
		return Tree.findFirst(this.rootNode, checker);
	}

	filterWithAncestors(checker) {
		return Tree.filterWithAncestors(this.rootNode, checker);
	}

	forEach(iterator) {
		return Tree.forEach(this.rootNode, iterator);
	}
}

Tree.getAncestors = getAncestors;
Tree.getNearestAncestorWithNext = getNearestAncestorWithNext;
Tree.getChildren = getChildren;
Tree.toList = toList;
Tree.findFirst = findFirst;
Tree.moveNodeUp = moveNodeUp;
Tree.moveNodeDown = moveNodeDown;
Tree.filterWithAncestors = filterWithAncestors;
Tree.forEach = forEach;


module.exports = Tree;
