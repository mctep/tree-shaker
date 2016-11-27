const $ = require('jquery');
const AvailableList = require('./available-list');
const normalize = require('lib/normalize');
const SelectedModel = require('tree-shaker/models/selected');

class TreeShaker {
	constructor(props) {
		const { nodes } = props;

		const { index, list, root } = normalize(nodes);

		this.index = index;
		this.list = list;
		this.root = root;

		this.selected = new SelectedModel([]);

		this.$element = $('<div></div>');

		this.renderAvailableList();
	}

	renderAvailableList() {
		const { index, list, selected } = this;
		const availableList = new AvailableList({
			index,
			list,
			onSelect: this.handleNodeSelect.bind(this),
			selected,
		});

		this.$element.append(availableList.$element);
	}

	handleNodeSelect(id) {
		this.selected.toggle(id);
	}
}

module.exports = TreeShaker;
