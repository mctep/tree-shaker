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
		this.renderChosenList();
	}

	handleAvailableSelect(id) {
		this.available.selected.toggle(id);
	}

	handleChosenSelect(id) {
		this.chosen.selected.toggle(id);
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
			onSelect: this.handleAvailableSelect.bind(this),
			selected: available.selected,
		});

		this.$element.append(availableList.$element);
	}

	renderChooseButtons() {
		const chooseButtons = new ChooseButtons({
			availableSelected: this.available.selected,
			chosenSelected: this.chosen.selected,
			onMoveFromChosenClick: this.handleMoveFromChosenClick.bind(this),
			onMoveToChosenClick: this.handleMoveToChosenClick.bind(this),
		});

		this.$element.append(chooseButtons.$element);
	}

	renderChosenList() {
		const { index, chosen } = this;

		const chosenList = new AvailableList({
			disabled: chosen.disabled,
			index,
			list: chosen.list,
			onSelect: this.handleChosenSelect.bind(this),
			selected: chosen.selected,
		});

		this.$element.append(chosenList.$element);
	}
}

module.exports = TreeShaker;
