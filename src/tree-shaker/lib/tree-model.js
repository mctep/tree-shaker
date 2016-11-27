const normalize = require('./normalize');

class ListModel {
	constructor(list) {
		this.list = list;
		this.selectedList = [];
	}

	isSelected(node) {
		return this.selectedList.includes(node);
	}

	select(node) {
		this.selectedList.push(node);
	}

	deselect(node) {
		this.selectedList = this.selectedList.filter((selectedNode) => {
			return selectedNode !== node;
		});
	}

	toggleSelect(node) {
		if (this.isSelected(node)) {
			this.deselect(node);
		} else {
			this.select(node);
		}
	}

	add(list) {
		this.list = this.list.concat(list);
	}

	remove(list) {
		this.list = this.list.filter((node) => {
			return !list.includes(node);
		});

		this.selected = this.selected.filter((node) => {
			return !list.includes(node);
		});
	}
}

class TreeModel {
	constructor(nodes) {
		const { index, list, root } = normalize(nodes);

		this.index = index;
		this.list = list;
		this.root = root;

		this.available = new ListModel(list.slice(0));
		this.chosen = new ListModel([]);
	}

	getById(id) {
		return this.index[id];
	}

	moveSelectedAvailableToChosen() {
		const nodes = this.available.selected;

		this.available.remove(nodes);
		this.chosen.add(nodes);
	}

	moveChosenSelectedToAvailable() {
		const nodes = this.chosen.selected;

		this.chosen.remove(nodes);
		this.available.add(nodes);
	}
}

module.exports = TreeModel;
