const _ = require('lodash');
const Select = require('./select');
const assembleElements = require('./assemble-elements');
const Tree = require('./lib/tree');
const moveToChosen = require('./lib/move-to-chosen');
const removeFromChosen = require('./lib/remove-from-chosen');
const escapeRegexp = require('./lib/escape-reg-exp');
const { getNodesForSorting, moveUp, moveDown } = require('./lib/sorting-nodes');

// from default-theme/styles/select.css
const DEFAULT_OPTION_HEIGHT = 24;

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
		this.props.templates = props.templates;
		this.props.classNames = props.classNames;

		this.createAvailableSelect();
		this.createChosenSelect();
		this.createMovingButtons();
		this.createSortingButtons();
		this.createFilterInput();

		this.assembleElements();
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
			onDblclick: this.handleMoveToChosenClick,
			onSelect: this.handleAvailableSelect,
			optionHeight: DEFAULT_OPTION_HEIGHT,
			templateOption: this.props.templates.availableOption,
		});
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
			onDblclick: this.handleRemoveFromChosenClick,
			onSelect: this.handleChosenSelect,
			optionHeight: DEFAULT_OPTION_HEIGHT,
			templateOption: this.props.templates.chosenOption,
		});
	}

	createMovingButtons() {
		const { templates } = this.props;

		this.$moveToChosenButton = templates.moveToChosenButton()
		.on('click', this.handleMoveToChosenClick);

		this.$removeFromChosenButton = templates.removeFromChosenButton()
		.on('click', this.handleRemoveFromChosenClick);

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
	}

	createSortingButtons() {
		const { templates } = this.props;

		this.handleMoveUpClick = this.handleMoveUpClick.bind(this);
		this.handleMoveDownClick = this.handleMoveDownClick.bind(this);

		this.$moveUpButton = templates.moveUpButton()
		.on('click', this.handleMoveUpClick);
		this.$moveDownButton = templates.moveDownButton()
		.on('click', this.handleMoveDownClick);

		this.refreshMoveUpButton();
		this.refreshMoveDownButton();
	}

	createFilterInput() {
		const { templates } = this.props;

		this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
		this.$filterInput = templates.inputFilter()
		.on('keyup', this.handleFilterInputChange);
	}

	setNodes(nodes) {
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

	updateHeight() {
		this.availableSelect.updateHeight();
		this.chosenSelect.updateHeight();
	}

	assembleElements() {
		const { classNames } = this.props;

		const {
			$filterInput,
			$moveToChosenButton,
			$removeFromChosenButton,
			$moveUpButton,
			$moveDownButton,
		} = this;

		const $availableSelect = this.availableSelect.$element;
		const $chosenSelect = this.chosenSelect.$element;

		this.$element = assembleElements({
			$availableSelect,
			$chosenSelect,
			$filterInput,
			$moveDownButton,
			$moveToChosenButton,
			$moveUpButton,
			$removeFromChosenButton,
		}, classNames);
	}
}

TreeShaker.Tree = Tree;

module.exports = TreeShaker;
