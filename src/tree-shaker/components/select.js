const _ = require('lodash');
const $ = require('jquery');
const { selectRegion, toggleSingleSelection } = require('lib/selections');
const cn = require('lib/classnames');

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

		this.$element = $(`<div class=${classNames.list}></div>`);
		this.handleOptionClick = this.handleOptionClick.bind(this);
		this.$element.delegate('[data-option-id]', 'click', this.handleOptionClick);
	}

	clearState() {
		this.options = [];
		this.index = {};
		this.optionsIds = [];
		this.visibleOptionsIds = [];
		this.disabledOptionsIds = [];
		this.selectedOptionsIds = [];
		this.lastClickedId = null;
	}

	setOptions(options) {
		this.clearState();
		this.options = options;
		this.optionsById = _.keyBy(options, 'id');
		this.optionsIds = _.map(options, 'id');
	}

	setVisibleOptionsIds(ids) {
		this.visibleOptionsIds = ids;
	}

	setDisabledOptionsIds(ids) {
		this.disabledOptionsIds = ids;
	}

	setSelectedOptionsIds(ids) {
		this.selectedOptionsIds = ids;
	}

	getAvailableIdsForSections() {
		return _.without(this.optionsIds, ...this.disabledOptionsIds);
	}

	getLastClickedId() {
		return this.lastClickedId || this.optionsIds[0];
	}

	handleOptionClick(event) {
		const idClicked = $(event.target).data('option-id').toString();
		const availableIdsForSelection = this.getAvailableIdsForSections();

		if (!_.includes(availableIdsForSelection, idClicked)) {
			return;
		}

		const lastClickedId = this.getLastClickedId();

		const selectors = {
			region: () => {
				return selectRegion(
					availableIdsForSelection,
					idClicked,
					lastClickedId,
				);
			},
			single: () => {
				this.lastClickedId = idClicked;

				return [idClicked];
			},
			toggle: () => {
				this.lastClickedId = idClicked;
				const selectedIds = this.selectedOptionsIds;

				return toggleSingleSelection(selectedIds, idClicked);
			},
		};

		const mode = selectMode();
		const selector = selectors[mode];

		this.setSelectedOptionsIds(selector());
		this.render();
		this.props.onSelect(this.selectedOptionsIds);

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

	getOptionHtml(option, state) {
		const { classNames } = this.props;
		const { id } = option;
		const { disabled, selected } = state;
		const html = this.props.optionTemplate(option, state);

		const className = cn({
			[classNames.option]: true,
			[classNames.disabled]: disabled,
			[classNames.selected]: selected,
		});

		return `<div class="${className}" data-option-id="${id}">${html}</div>`;
	}

	getHtml() {
		return _.map(this.visibleOptionsIds, (id) => {
			const option = this.optionsById[id];
			const disabled = _.includes(this.disabledOptionsIds, id);
			const selected = _.includes(this.selectedOptionsIds, id);

			return this.getOptionHtml(option, { disabled, selected });
		}).join('');
	}

	render() {
		this.$element.html(this.getHtml());
	}
}

module.exports = Select;
