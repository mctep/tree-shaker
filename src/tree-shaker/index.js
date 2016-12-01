const $ = require('jquery');
const _ = require('lodash');
const Select = require('./components/select');
const SelectVirtual = require('./components/select-virtual');
const normalize = require('lib/normalize');
const {
	moveSelectedNodesToChosen,
	removeSelectedNodesFromChosen,
} = require('lib/move-nodes');

class TreeShaker {
	constructor(props) {
		this.handleAvailableSelect = this.handleAvailableSelect.bind(this);
		this.handleChosenSelect = this.handleChosenSelect.bind(this);
		this.handleNodesUpdate = this.handleNodesUpdate.bind(this);
		this.handleMoveToChosenClick = this.handleMoveToChosenClick.bind(this);
		this.handleRemoveToChosenClick = this.handleRemoveToChosenClick.bind(this);

		this.props = {};
		this.props.nodesObservable = props.nodesObservable;

		this.availableSelect = new SelectVirtual({
			classNames: {
				disabled: 'disabled',
				list: 'list',
				option: 'node',
				selected: 'selected',
			},
			height: 200,
			onSelect: this.handleAvailableSelect,
			optionHeight: 20,
			optionTemplate(option) {
				return `#${option.anchestorsIds} ${option.title}`;
			},
		});

		this.chosenSelect = new Select({
			classNames: {
				disabled: 'disabled',
				list: 'list',
				option: 'node',
				selected: 'selected',
			},
			onSelect: this.handleChosenSelect,
			optionTemplate(option) {
				return `#${option.anchestorsIds} ${option.title}`;
			},
		});

		this.unsubscribe = this.props.nodesObservable.subscribe(
			this.handleNodesUpdate
		);

		this.$moveToChosenButton = $('<button type="button">-&gt;</button>')
		.on('click', this.handleMoveToChosenClick);
		this.$removeFromChosenButton = $('<button type="button">&lt;-</button>')
		.on('click', this.handleRemoveToChosenClick);
		const $buttonsContainer = $('<div></div>');

		$buttonsContainer
			.append(this.$moveToChosenButton)
			.append(this.$removeFromChosenButton);

		this.$element = $('<div></div>')
			.append(this.availableSelect.$element)
			.append(this.chosenSelect.$element)
			.append($buttonsContainer);

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
	}

	getNodesByIds(ids) {
		return _.compact(_.map(ids, (id) => {
			return this.nodesById[id];
		}));
	}

	handleNodesUpdate(nodes) {
		const { list, index } = normalize(nodes);

		this.nodesById = index;
		this.availableSelect.setOptions(list);
		this.availableSelect.render();
	}

	handleAvailableSelect() {
		this.refreshMoveToChosenButton();
	}

	handleChosenSelect() {
		this.refreshRemoveToChosenButton();
	}

	refreshMoveToChosenButton() {
		const disabled = !this.availableSelect.selectedOptionsIds.length;

		this.$moveToChosenButton.attr({ disabled });
	}

	refreshRemoveToChosenButton() {
		const disabled = !this.chosenSelect.selectedOptionsIds.length;

		this.$removeFromChosenButton.attr({ disabled });
	}

	handleMoveToChosenClick() {
		const {
			availableDisabledIds,
			availableSelectedIds,
			chosenIds,
			chosenSelectedIds,
		} = moveSelectedNodesToChosen({
			currentAvailableDisabledIds: this.availableSelect.disabledOptionsIds,
			currentChosenIds: this.chosenSelect.optionsIds,
			selectedIds: this.availableSelect.selectedOptionsIds,
		});

		this.availableSelect.disabledOptionsIds = availableDisabledIds;
		this.availableSelect.selectedOptionsIds = availableSelectedIds;
		this.chosenSelect.setOptions(this.getNodesByIds(chosenIds));
		this.chosenSelect.visibleOptionsIds = chosenIds;
		this.chosenSelect.selectedOptionsIds = chosenSelectedIds;

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
		this.availableSelect.render();
		this.chosenSelect.render();
	}

	handleRemoveToChosenClick() {
		const {
			availableDisabled,
			availableSelected,
			chosen,
			chosenSelected,
		} = removeSelectedNodesFromChosen({
			availableDisabled: this.availableSelect.disabledOptionsIds,
			chosen: this.chosenSelect.optionsIds,
			chosenSelected: this.chosenSelect.selectedOptionsIds,
		});

		this.availableSelect.disabledOptionsIds = availableDisabled;
		this.availableSelect.selectedOptionsIds = availableSelected;
		this.chosenSelect.setOptions(this.getNodesByIds(chosen));
		this.chosenSelect.visibleOptionsIds = chosen;
		this.chosenSelect.selectedOptionsIds = chosenSelected;

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
		this.availableSelect.render();
		this.chosenSelect.render();
	}
}

module.exports = TreeShaker;
