const _ = require('lodash');
const $ = require('jquery');
const selectRegion = require('lib/select-region');
const cn = require('lib/classnames');

const DBLCLICK_TIMEOUT = 200;

class Select {
	constructor(props) {
		this.clearState();
		this.props = {};

		const classNames = this.props.classNames = {
			disabled: _.get(props, 'classNames.disabled', ''),
			list: _.get(props, 'classNames.list', ''),
			option: _.get(props, 'classNames.option', ''),
			selected: _.get(props, 'classNames.selected', ''),
		};

		this.props.optionTemplate = props.optionTemplate;
		this.props.onSelect = props.onSelect;
		this.props.onDblclick = props.onDblclick;

		// it is needed because we use render as replacing html
		this.dblclickTimeout = null;

		this.$element = $(`<div class=${classNames.list}></div>`);
		this.handleOptionClick = this.handleOptionClick.bind(this);
		this.$element.delegate('[data-option-id]', 'click', this.handleOptionClick);
	}

	clearState() {
		this.tree = null;
		this.options = [];
		this.visibleOptions = [];
		this.lastClicked = null;
	}

	setTree(tree) {
		this.clearState();
		this.tree = tree;
		this.updateOptions();
	}

	updateOptions() {
		this.options = this.tree.toList();
		this.visibleOptions = [];
		this.lastClicked = null;
	}

	setVisibleOptions(options) {
		this.visibleOptions = options;
	}

	getAvailableIdsForSections() {
		return _.filter(this.options, (option) => {
			return !option.data.hidden;
		});
	}

	getLastClicked() {
		return this.lastClicked || this.tree.rootNode.first;
	}

	setLastClicked(lastClicked) {
		this.waitDblclick = true;
		this.dblclickTimeout = setTimeout(() => {
			this.waitDblclick = false;
		}, DBLCLICK_TIMEOUT);

		this.lastClicked = lastClicked;
	}

	handleOptionClick(event) {
		const id = $(event.target).data('option-id').toString();
		const clicked = this.tree.getNodeById(id);
		const availableForSelection = this.getAvailableIdsForSections();

		if (!_.includes(availableForSelection, clicked)) {
			return;
		}

		const lastClicked = this.getLastClicked();
		const dblclicked = this.waitDblclick && lastClicked === clicked;

		const selectors = {
			region: () => {
				return selectRegion(
					availableForSelection,
					clicked,
					lastClicked,
				);
			},
			single: () => {
				this.setLastClicked(clicked);

				this.options.forEach((option) => {
					option.data.selected = option === clicked;
				});
			},
			toggle: () => {
				this.setLastClicked(clicked);

				clicked.data.selected = !clicked.data.selected;
			},
		};

		const mode = selectMode();
		const selector = selectors[mode];

		selector();
		this.render();
		this.props.onSelect();

		if (dblclicked && mode === 'single') {
			this.props.onDblclick();
		}

		function selectMode() {
			if (event.shiftKey) {
				return 'region';
			}

			if (event.ctrlKey || event.metaKey) {
				return 'toggle';
			}

			return 'single';
		}
	}

	getOptionHtml(option) {
		const { classNames } = this.props;
		const { id } = option;
		const { hidden, selected } = option.data;
		const html = this.props.optionTemplate(option);

		const className = cn({
			[classNames.option]: true,
			[classNames.disabled]: hidden,
			[classNames.selected]: selected,
		});

		return `<div class="${className}" data-option-id="${id}">${html}</div>`;
	}

	getHtml() {
		return _.map(this.visibleOptions, (option) => {
			return this.getOptionHtml(option);
		}).join('');
	}

	render() {
		this.$element.html(this.getHtml());
	}
}

module.exports = Select;
