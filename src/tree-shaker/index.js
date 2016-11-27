const $ = require('jquery');
const AvailableList = require('./components/available-list');
const ChooseButtons = require('./components/choose-buttons');
const normalize = require('lib/normalize');
const ArrayModel = require('tree-shaker/models/array');

class TreeShaker {
	constructor(props) {
		const { nodes } = props;

		const { index, list, root } = normalize(nodes);

		this.index = index;
		this.list = list;
		this.root = root;

		this.selected = new ArrayModel([]);
		this.chosen = new ArrayModel([]);

		this.$element = $('<div></div>');

		this.renderAvailableList();
		this.renderChooseButtons();
	}

	handleNodeSelect(id) {
		this.selected.toggle(id);
	}

	handleMoveFromChosenClick() {
		this.chosen.remove(this.selected.state);
	}

	handleMoveToChosenClick() {
		this.chosen.add(this.selected.state);
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

	renderChooseButtons() {
		const { selected, chosen } = this;
		const cohooseButtons = new ChooseButtons({
			chosen,
			onMoveFromChosenClick: this.handleMoveFromChosenClick.bind(this),
			onMoveToChosenClick: this.handleMoveToChosenClick.bind(this),
			selected,
		});

		this.$element.append(cohooseButtons.$element);
	}
}

module.exports = TreeShaker;
