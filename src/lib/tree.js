class Tree {
	static getAncestors(node, rootNode) {
		const result = [];
		let { parent } = node;

		while (parent && parent !== rootNode) {
			result.push(parent);
			parent = parent.parent;
		}

		return result;
	}

	static getNearestAncestorWithNext(node, rootNode) {
		let { parent } = node;

		while (parent && parent !== rootNode) {
			if (parent.next) {
				return parent.next;
			}

			parent = parent.parent;
		}

		return null;
	}

	static getChildren(node) {
		const result = [];
		let child = node.first;

		while (child) {
			result.push(child);
			child = child.next;
		}

		return result;
	}

	static toList(rootNode) {
		const result = [];
		const checkLooping = loopChecker();
		let node = rootNode.first;

		while (node) {
			checkLooping(node);
			result.push(node);
			node = node.first || node.next || Tree.getNearestAncestorWithNext(node);
		}

		return result;
	}

	// eslint-disable-next-line complexity
	static findFirst(rootNode, checker) {
		const checkLooping = loopChecker();
		let node = rootNode.first;

		while (node) {
			checkLooping(node);

			if (checker(node)) {
				return node;
			}

			node = node.first || node.next ||
				Tree.getNearestAncestorWithNext(node, rootNode);
		}

		return null;
	}

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

		this.index[id] = null;
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
}

function loopChecker() {
	const index = {};

	return (node) => {
		if (index[node.id]) {
			throw new Error(`Looping detected "${node.id}"`);
		}

		index[node.id] = true;
	};
}

module.exports = Tree;
