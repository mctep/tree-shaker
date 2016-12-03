const $ = require('jquery');
const Select = require('./components/select');
const Tree = require('lib/tree');
const moveToChosen = require('lib/move-to-chosen');

class TreeShaker {
	constructor(props) {
		this.handleAvailableSelect = this.handleAvailableSelect.bind(this);
		this.handleChosenSelect = this.handleChosenSelect.bind(this);
		this.handleNodesUpdate = this.handleNodesUpdate.bind(this);
		this.handleMoveToChosenClick = this.handleMoveToChosenClick.bind(this);
		this.handleRemoveFromChosenClick =
			this.handleRemoveFromChosenClick.bind(this);

		this.props = {};
		this.props.nodesObservable = props.nodesObservable;

		this.availableSelect = new Select({
			classNames: {
				disabled: 'disabled',
				list: 'list',
				option: 'node',
				selected: 'selected',
			},
			height: 600,
			onDblclick: this.handleMoveToChosenClick,
			onSelect: this.handleAvailableSelect,
			optionHeight: 20,
			templates: props.availableTemplates,
		});

		this.chosenSelect = new Select({
			classNames: {
				disabled: 'disabled',
				list: 'list',
				option: 'node',
				selected: 'selected',
			},
			height: 600,
			onDblclick: this.handleRemoveFromChosenClick,
			onSelect: this.handleChosenSelect,
			optionHeight: 20,
			templates: props.chosenTemplates,
		});

		this.unsubscribe = this.props.nodesObservable.subscribe(
			this.handleNodesUpdate
		);

		this.$moveToChosenButton = $('<button type="button">-&gt;</button>')
		.on('click', this.handleMoveToChosenClick);
		this.$removeFromChosenButton = $('<button type="button">&lt;-</button>')
		.on('click', this.handleRemoveFromChosenClick);
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

	handleNodesUpdate(nodes) {
		this.availableTree = new Tree(nodes);
		this.chosenTree = new Tree([]);

		this.availableSelect.setTree(this.availableTree);
		this.chosenSelect.setTree(this.chosenTree);

		this.availableSelect.render();
		this.chosenSelect.render();
	}

	handleAvailableSelect() {
		this.refreshMoveToChosenButton();
	}

	handleChosenSelect() {
		this.refreshRemoveToChosenButton();
	}

	refreshMoveToChosenButton() {
		let disabled = true;

		if (this.availableTree) {
			disabled = !this.availableTree.findFirst((node) => {
				return node.data.selected;
			});
		}

		this.$moveToChosenButton.attr({ disabled });
	}

	refreshRemoveToChosenButton() {
		let disabled = true;

		if (this.chosenTree) {
			disabled = !this.chosenTree.findFirst((node) => {
				return node.data.selected;
			});
		}

		this.$removeFromChosenButton.attr({ disabled });
	}

	handleMoveToChosenClick() {
		moveToChosen({
			available: this.availableTree,
			chosen: this.chosenTree,
		});

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
		this.availableSelect.updateOptions();
		this.availableSelect.render();
		this.chosenSelect.updateOptions();
		this.chosenSelect.render();
	}

	handleRemoveFromChosenClick() {
		this.render();

		// const {
		// 	availableDisabled,
		// 	availableSelected,
		// 	chosen,
		// 	chosenSelected,
		// } = removeSelectedNodesFromChosen({
		// 	availableDisabled: this.availableSelect.disabledOptionsIds,
		// 	chosen: this.chosenSelect.optionsIds,
		// 	chosenSelected: this.chosenSelect.selectedOptionsIds,
		// });
		//
		// this.availableSelect.disabledOptionsIds = availableDisabled;
		// this.availableSelect.selectedOptionsIds = availableSelected;
		// this.chosenSelect.setOptions(getNodesByIds(chosen));
		// this.chosenSelect.visibleOptionsIds = chosen;
		// this.chosenSelect.selectedOptionsIds = chosenSelected;
		//
		// this.refreshMoveToChosenButton();
		// this.refreshRemoveToChosenButton();
		// this.availableSelect.render();
		// this.chosenSelect.render();
	}
}

module.exports = TreeShaker;
