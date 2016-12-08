const _ = require('lodash');
const Select = require('./select');
const assembleElements = require('./assemble-elements');
const moveToChosen = require('./lib/move-to-chosen');
const removeFromChosen = require('./lib/remove-from-chosen');
const escapeRegexp = require('./lib/escape-reg-exp');
const { getNodesForSorting, moveUp, moveDown } = require('./lib/sorting-nodes');
const serializeChosenTree = require('./lib/serialize-chosen-tree');

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

class TreeShakerPrivate {
	constructor(props) {
		this.props = props;

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
		.on('keyup', this.handleFilterInputChange)
		.on('change', this.handleFilterInputChange);
	}

	filterNodesByInputValue() {
		const value = this.$filterInput.val();

		if (this.lastFilterValule === value) {
			return false;
		}

		const reg = new RegExp(escapeRegexp(value), 'ig');

		this.availableTree.forEach((node) => {
			node.data.selected = false;
			node.data.hidden = !node.data.name.match(reg);
		});

		this.lastFilterValule = value;

		return true;
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
		this.handleChosenNodesChange();
	}

	handleRemoveFromChosenClick() {
		removeFromChosen({
			available: this.availableTree,
			chosen: this.chosenTree,
		});

		this.refresh();
		this.handleChosenNodesChange();
	}

	handleMoveUpClick() {
		const nodes = getNodesForSorting(this.chosenTree);

		if (!nodes.length) {
			return;
		}

		if (moveUp(nodes)) {
			this.refresh();
			this.handleChosenNodesChange();
			this.chosenSelect.moveSelectedOptionAboveIfInvisible();
		}
	}

	handleMoveDownClick() {
		const nodes = getNodesForSorting(this.chosenTree);

		if (!nodes.length) {
			return;
		}

		if (moveDown(nodes)) {
			this.refresh();
			this.handleChosenNodesChange();
			this.chosenSelect.moveSelectedOptionBelowIfInvisible();
		}
	}

	handleFilterInputChange() {
		if (this.filterNodesByInputValue()) {
			this.refresh();
		}
	}

	handleChosenNodesChange() {
		if (!this.onChosenNodesChangeListener) {
			return;
		}

		this.onChosenNodesChangeListener(
			serializeChosenTree(this.chosenTree)
		);
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
		function isVisible(node) {
			return !node.data.hidden;
		}

		this.filterNodesByInputValue();

		this.availableSelect
		.refresh(this.availableTree.filterWithAncestors(isVisible));
		this.availableSelect.render();

		this.chosenSelect
		.refresh(this.chosenTree.filterWithAncestors(isVisible));
		this.chosenSelect.render();

		this.refreshMoveToChosenButton();
		this.refreshRemoveToChosenButton();
		this.refreshMoveUpButton();
		this.refreshMoveDownButton();
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

module.exports = TreeShakerPrivate;
