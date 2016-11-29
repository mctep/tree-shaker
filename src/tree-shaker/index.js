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

		this.available = {
			disabled: new ArrayModel([]),
			list: new ArrayModel(list),
			selected: new ArrayModel([]),
		};

		this.chosen = {
			disabled: new ArrayModel([]),
			list: new ArrayModel([]),
			selected: new ArrayModel([]),
		};

		this.$element = $('<div></div>');

		this.renderAvailableList();
		this.renderChooseButtons();
	}

	handleNodeSelect(id) {
		this.available.selected.toggle(id);
	}

	handleMoveFromChosenClick() {
		const selected = this.chosen.selected.state;

		this.chosen.list.remove(selected);
		this.available.disabled.remove(selected);
	}

	handleMoveToChosenClick() {
		const selected = this.available.selected.state;

		this.chosen.list.add(selected);
		this.available.selected.remove(selected);
		this.available.disabled.add(selected);
	}

	renderAvailableList() {
		const { index, available } = this;

		const availableList = new AvailableList({
			disabled: available.disabled,
			index,
			list: available.list,
			onSelect: this.handleNodeSelect.bind(this),
			selected: available.selected,
		});

		this.$element.append(availableList.$element);
	}

	renderChooseButtons() {
		const cohooseButtons = new ChooseButtons({
			availableSelected: this.available.selected,
			chosenSelected: this.chosen.selected,
			onMoveFromChosenClick: this.handleMoveFromChosenClick.bind(this),
			onMoveToChosenClick: this.handleMoveToChosenClick.bind(this),
		});

		this.$element.append(cohooseButtons.$element);
	}
}

module.exports = TreeShaker;
