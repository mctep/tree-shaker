const _ = require('lodash');
const $ = require('jquery');
const selectRegion = require('./lib/select-region');
const cn = require('./lib/classnames');
const getIEVersion = require('./lib/get-ie-version');
const getVirtualScrolling = require('./lib/get-virtual-scrolling');

const DBLCLICK_TIMEOUT = 200;
const IE_VERSION_SUPPORTS_USER_SELECT = 10;

class Select {
	constructor(props) {
		this.handleScroll = this.handleScroll.bind(this);
		this.handleOptionClick = this.handleOptionClick.bind(this);

		this.props = {};

		const classNames = this.props.classNames = {
			disabled: _.get(props, 'classNames.disabled', ''),
			option: _.get(props, 'classNames.option', ''),
			select: _.get(props, 'classNames.select', ''),
			selected: _.get(props, 'classNames.selected', ''),
		};

		this.props.optionHeight = props.optionHeight;
		this.props.optionTemplate = props.optionTemplate;
		this.props.onSelect = props.onSelect;
		this.props.onDblclick = props.onDblclick;
		this.props.templates = props.templates;
		this.props.getOptionById = props.getOptionById;

		// it is needed because we use render as replacing html
		this.dblclickTimeout = null;

		this.$topPad = $('<div></div>');
		this.$bottomPad = $('<div></div>');

		this.$element = $(`<div class="${classNames.select}"></div>`)
		.prepend(this.$topPad)
		.append(this.$bottomPad)
		.on('scroll', this.handleScroll)
		.delegate('[data-option-id]', 'click', this.handleOptionClick);

		const ieVerstion = getIEVersion();

		if (ieVerstion && ieVerstion < IE_VERSION_SUPPORTS_USER_SELECT) {
			this.$element.on('selectstart', () => {
				return false;
			});
		}

		this.refresh();
	}

	updateHeight() {
		this.height = this.$element.height();
		this.handleScroll();
	}

	refresh(options) {
		this.options = options || [];
		this.visibleOptions = [];
		this.lastClicked = null;
		this.bottomPadHeight = 0;
		this.topPadHeight = 0;
		this.updateScrolling();
	}

	updateScrolling() {
		const containerHeight = this.height;
		const currentVisibleItems = this.visibleOptions;
		const itemHeight = this.props.optionHeight;
		const items = this.options;
		const scrollTop = this.$element.scrollTop();

		const scrolling = getVirtualScrolling({
			containerHeight,
			currentVisibleItems,
			itemHeight,
			items,
			scrollTop,
		});

		if (!scrolling) {
			return null;
		}

		const {
			bottomPadHeight,
			topPadHeight,
			visibleItems,
		} = scrolling;

		this.bottomPadHeight = bottomPadHeight;
		this.topPadHeight = topPadHeight;

		this.visibleOptions = visibleItems;

		return visibleItems;
	}

	getAvailableIdsForSections() {
		return _.filter(this.options, (option) => {
			return !option.data.disabled;
		});
	}

	getLastClicked() {
		return this.lastClicked || this.options[0];
	}

	setLastClicked(lastClicked) {
		this.waitDblclick = true;
		this.dblclickTimeout = setTimeout(() => {
			this.waitDblclick = false;
		}, DBLCLICK_TIMEOUT);

		this.lastClicked = lastClicked;
	}

	handleScroll() {
		const newVisibleIds = this.updateScrolling();

		if (newVisibleIds) {
			this.render();
		}
	}

	handleOptionClick(event) {
		const id = $(event.currentTarget).data('option-id').toString();
		const clicked = this.props.getOptionById(id);
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
					lastClicked
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

			if (_.some([event.ctrlKey, event.metaKey, event.altKey])) {
				return 'toggle';
			}

			return 'single';
		}
	}

	getOptionElement(option) {
		const { classNames } = this.props;
		const { id } = option;
		const { disabled, selected } = option.data;

		const className = cn(classNames.option, {
			[classNames.disabled]: disabled,
			[classNames.selected]: selected,
		});

		const $optionElement =
		$(`<div class="${className}" data-option-id="${id}"></div>`);

		$optionElement.append(this.props.templates.getElement(option));

		return $optionElement;
	}

	updateOptionElement(option, $element) {
		const { classNames } = this.props;
		const { disabled, selected } = option.data;

		const className = cn({
			[classNames.option]: true,
			[classNames.disabled]: disabled,
			[classNames.selected]: selected,
		});

		$element.attr({ class: className });
		this.props.templates.updateElement(option, $element.children());

		return $element;
	}

	removeHiddenElements() {
		const $children = this.$element.children('[data-option-id]');
		const childrenLength = $children.length;
		const { visibleOptions } = this;

		for (let idx = 0; idx < childrenLength; idx += 1) {
			const $child = $children.eq(idx);
			const id = $child.data('option-id');

			if (!_.find(visibleOptions, { id })) {
				$child.remove();
			}
		}
	}

	addOrUpdateVisibleElements() {
		const $children = this.$element.children('[data-option-id]');

		const { visibleOptions } = this;
		const visibleOptionsLength = visibleOptions.length;
		let $prevChild = this.$topPad;

		for (let idx = 0; idx < visibleOptionsLength; idx += 1) {
			const option = visibleOptions[idx];
			const $child = $children.filter(`[data-option-id="${option.id}"]`);
			let $updated = null;

			if ($child.length) {
				$updated = this.updateOptionElement(option, $child);
			} else {
				$updated = this.getOptionElement(option, $child);
			}

			if (!$updated.prev().is($prevChild)) {
				$updated.insertAfter($prevChild);
			}

			$prevChild = $updated;
		}
	}

	render() {
		const { $topPad, $bottomPad } = this;

		$topPad.height(this.topPadHeight);
		$bottomPad.height(this.bottomPadHeight);

		this.removeHiddenElements();
		this.addOrUpdateVisibleElements();
	}
}

module.exports = Select;
