const $ = require('jquery');
const _ = require('lodash');
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
		this.props.templates = props.templates;
		this.props.classNames = props.classNames;

		this.$element = $(`<div class="${props.classNames.container}"></div>`);

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
		const { classNames } = this.props;

		this.handleMoveToChosenClick = this.handleMoveToChosenClick.bind(this);
		this.handleAvailableSelect = this.handleAvailableSelect.bind(this);

		const selectClassNames = _.assign({}, classNames.select, {
			select: `${classNames.select.select} ${classNames.selectAvailable}`,
		});

		this.availableSelect = new Select({
			classNames: selectClassNames,
			getOptionById: (id) => {
				return this.availableTree.getNodeById(id);
			},
			height: 600,
			onDblclick: this.handleMoveToChosenClick,
			onSelect: this.handleAvailableSelect,
			optionHeight: 24,
			templates: this.props.templates.available,
		});

		this.$element.append(this.availableSelect.$element);
	}

	createChosenSelect() {
		const { classNames } = this.props;

		this.handleRemoveFromChosenClick =
		this.handleRemoveFromChosenClick.bind(this);
		this.handleChosenSelect = this.handleChosenSelect.bind(this);

		const selectClassNames = _.assign({}, classNames.select, {
			select: `${classNames.select.select} ${classNames.selectChosen}`,
		});

		this.chosenSelect = new Select({
			classNames: selectClassNames,
			getOptionById: (id) => {
				return this.chosenTree.getNodeById(id);
			},
			height: 600,
			onDblclick: this.handleRemoveFromChosenClick,
			onSelect: this.handleChosenSelect,
			optionHeight: 24,
			templates: this.props.templates.chosen,
		});

		this.$element.append(this.chosenSelect.$element);
	}

	createMovingButtons() {
		const { classNames, templates } = this.props;

		this.$moveToChosenButton = templates.moveToChosenButton.getElement()
		.on('click', this.handleMoveToChosenClick);

		this.$removeFromChosenButton = templates.removeFromChosenButton.getElement()
		.on('click', this.handleRemoveFromChosenClick);

		const $movingButtons =
		$(`<div class=${classNames.buttonsMove.container}></div>`)
		.append(this.$moveToChosenButton)
		.append(this.$removeFromChosenButton);

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();

		$movingButtons.insertAfter(this.availableSelect.$element);
	}

	createSortingButtons() {
		const { classNames, templates } = this.props;

		this.handleMoveUpClick = this.handleMoveUpClick.bind(this);
		this.handleMoveDownClick = this.handleMoveDownClick.bind(this);

		this.$moveUpButton = templates.moveUpButton.getElement()
		.on('click', this.handleMoveUpClick);
		this.$moveDownButton = templates.moveDownButton.getElement()
		.on('click', this.handleMoveDownClick);

		const $sortingButtons = $(`<div class=${classNames.buttonsSort}></div>`);

		$sortingButtons
		.append(this.$moveUpButton)
		.append(this.$moveDownButton);

		this.refreshMoveUpButton();
		this.refreshMoveDownButton();

		this.$element.append($sortingButtons);
	}

	createFilterInput() {
		const { templates } = this.props;

		this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
		this.$filterInput = templates.inputFilter.getElement()
		.on('keyup', this.handleFilterInputChange);

		this.$element.append(this.$filterInput);
	}

	handleNodesUpdate(nodes) {
		this.availableTree = new Tree(nodes);
		this.chosenTree = new Tree([]);
		this.refresh();
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
		function visible(node) {
			return !node.data.hidden;
		}

		this.availableSelect
		.refresh(this.availableTree.filterWithAncestors(visible));
		this.availableSelect.render();

		this.chosenSelect
		.refresh(this.chosenTree.filterWithAncestors(visible));
		this.chosenSelect.render();

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
		this.refreshMoveUpButton();
		this.refreshMoveDownButton();
	}
}

module.exports = TreeShaker;
