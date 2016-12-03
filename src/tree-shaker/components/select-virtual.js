const Select = require('./select');
const getVirtualScrolling = require('lib/get-virtual-scrolling');

class SelectVitrual extends Select {
	constructor(props) {
		super(props);

		this.props.height = props.height;
		this.props.optionHeight = props.optionHeight;
		this.$element.height(this.props.height);

		this.handleScroll = this.handleScroll.bind(this);
		this.$element.on('scroll', this.handleScroll);
	}

	clearState() {
		super.clearState();
		this.bottomPadHeight = 0;
		this.topPadHeight = 0;
	}

	updateOptions() {
		super.updateOptions();
		this.updateScrolling();
	}

	updateScrolling() {
		const containerHeight = this.props.height;
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

		this.setVisibleOptions(visibleItems);

		return visibleItems;
	}

	handleScroll() {
		const newVisibleIds = this.updateScrolling();

		if (newVisibleIds) {
			this.render();
		}
	}

	getHtml() {
		const html = super.getHtml();
		const { topPadHeight, bottomPadHeight } = this;
		const topPadHtml = `<div style="height: ${topPadHeight}px"></div>`;
		const bottomPadHtml = `<div style="height: ${bottomPadHeight}px"></div>`;

		return [topPadHtml, html, bottomPadHtml].join('');
	}
}

module.exports = SelectVitrual;
