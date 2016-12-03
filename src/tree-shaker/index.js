const $ = require('jquery');
const Select = require('./components/select');
const Tree = require('lib/tree');
const moveToChosen = require('lib/move-to-chosen');
const removeFromChosen = require('lib/remove-from-chosen');
const escapeRegexp = require('lib/escape-reg-exp');
const { getNodesForSorting, moveUp, moveDown } = require('lib/sorting-nodes');

function hasSomeSelectedNode(tree) {
	if (!tree) {
		return false;
	}

	return Boolean(tree.findFirst((node) => {
		return node.data.selected;
	}));
}

class TreeShaker {
	constructor(props) {
		this.props = {};
		this.props.nodesObservable = props.nodesObservable;
		this.props.availableTemplates = props.availableTemplates;
		this.props.chosenTemplates = props.chosenTemplates;

		this.$element = $('<div></div>');

		this.createAvailableSelect();
		this.createChosenSelect();
		this.createMovingButtons();
		this.createSortingButtons();
		this.createFilterInput();

		this.handleNodesUpdate = this.handleNodesUpdate.bind(this);
		this.unsubscribe = this.props.nodesObservable.subscribe(
			this.handleNodesUpdate
		);
	}

	createAvailableSelect() {
		this.handleMoveToChosenClick = this.handleMoveToChosenClick.bind(this);
		this.handleAvailableSelect = this.handleAvailableSelect.bind(this);

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
			templates: this.props.availableTemplates,
		});

		this.$element.append(this.availableSelect.$element);
	}

	createChosenSelect() {
		this.handleRemoveFromChosenClick =
		this.handleRemoveFromChosenClick.bind(this);
		this.handleChosenSelect = this.handleChosenSelect.bind(this);

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
			templates: this.props.chosenTemplates,
		});

		this.$element.append(this.chosenSelect.$element);
	}

	createMovingButtons() {
		this.$moveToChosenButton = $('<button type="button">-&gt;</button>')
		.on('click', this.handleMoveToChosenClick);
		this.$removeFromChosenButton = $('<button type="button">&lt;-</button>')
		.on('click', this.handleRemoveFromChosenClick);

		const $movingButtons = $('<div></div>');

		$movingButtons
		.append(this.$moveToChosenButton)
		.append(this.$removeFromChosenButton);

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();

		this.$element.append($movingButtons);
	}

	createSortingButtons() {
		this.handleMoveUpClick = this.handleMoveUpClick.bind(this);
		this.handleMoveDownClick = this.handleMoveDownClick.bind(this);

		this.$moveUpButton = $('<button type="button">up</button>')
		.on('click', this.handleMoveUpClick);
		this.$moveDownButton = $('<button type="button">down</button>')
		.on('click', this.handleMoveDownClick);

		const $sortingButtons = $('<div></div>');

		$sortingButtons
		.append(this.$moveUpButton)
		.append(this.$moveDownButton);

		this.refreshMoveUpButton();
		this.refreshMoveDownButton();

		this.$element.append($sortingButtons);
	}

	createFilterInput() {
		this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
		this.$filterInput = $('<input type="text" />')
		.on('keyup', this.handleFilterInputChange);

		this.$element.append(this.$filterInput);
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
		this.refreshMoveUpButton();
		this.refreshMoveDownButton();
	}

	handleMoveToChosenClick() {
		moveToChosen({
			available: this.availableTree,
			chosen: this.chosenTree,
		});

		this.refresh();
	}

	handleRemoveFromChosenClick() {
		removeFromChosen({
			available: this.availableTree,
			chosen: this.chosenTree,
		});

		this.refresh();
	}

	handleMoveUpClick() {
		const nodes = getNodesForSorting(this.chosenTree);

		if (!nodes.length) {
			return;
		}

		if (moveUp(nodes)) {
			this.refresh();
		}
	}

	handleMoveDownClick() {
		const nodes = getNodesForSorting(this.chosenTree);

		if (!nodes.length) {
			return;
		}

		if (moveDown(nodes)) {
			this.refresh();
		}
	}

	handleFilterInputChange() {
		const value = this.$filterInput.val();
		const reg = new RegExp(escapeRegexp(value), 'ig');

		this.availableTree.forEach((node) => {
			node.data.selected = false;
			node.data.hidden = !node.data.name.match(reg);
		});

		this.refresh();
	}

	refreshMoveToChosenButton() {
		this.$moveToChosenButton.attr({
			disabled: !hasSomeSelectedNode(this.availableTree),
		});
	}

	refreshRemoveToChosenButton() {
		this.$removeFromChosenButton.attr({
			disabled: !hasSomeSelectedNode(this.chosenTree),
		});
	}

	refreshMoveUpButton() {
		this.$moveUpButton.attr({
			disabled: !hasSomeSelectedNode(this.chosenTree),
		});
	}

	refreshMoveDownButton() {
		this.$moveDownButton.attr({
			disabled: !hasSomeSelectedNode(this.chosenTree),
		});
	}

	refresh() {
		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
		this.refreshMoveUpButton();
		this.refreshMoveDownButton();
		this.availableSelect.updateOptions();
		this.availableSelect.render();
		this.chosenSelect.updateOptions();
		this.chosenSelect.render();
	}
}

module.exports = TreeShaker;
