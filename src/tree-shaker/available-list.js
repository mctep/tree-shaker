const $ = require('jquery');
const without = require('lodash/without');
const difference = require('lodash/difference');
const Component = require('./components/component');
const getAncestorsCount = require('lib/get-ancestors-count');

function delegate($element, selector, event) {
	return (handler) => {
		$element.delegate(selector, event, handler);

		return () => {
			$element.undelegate(selector, event, handler);
		};
	};
}

function getNodeHtml(node) {
	const { id, title } = node;
	let ancestorsCount = getAncestorsCount(node);
	let padding = '';

	while (ancestorsCount) {
		padding += '&nbsp';
		ancestorsCount -= 1;
	}

	return `${padding}#${id} ${title}`;
}

function refreshNode($element, classNames) {
	$element.toggleClass(classNames.selected, $element.data('selected'));
}

class AvailableList extends Component {
	constructor(props) {
		super();

		this.classNames = {
			list: 'list list-available',
			node: 'node node-available',
			selected: 'selected',
		};

		this.$element = $(`<div class=${this.classNames.list}></div>`);

		this.list = props.list;
		this.index = props.index;
		this.onSelect = props.onSelect;
		this.selected = props.selected;

		this.subscribe(
			delegate(this.$element, '[data-node-id]', 'click'),
			this.handleNodeClick
		);

		this.subscribe(this.selected, this.handleSelectedChanged);

		this.renderList();
	}

	handleNodeClick(event) {
		const $element = $(event.target);
		const id = $element.data('node-id');

		this.onSelect(id);
	}

	handleSelectedChanged(selected) {
		const $children = this.$element.children();

		const current = $children.toArray().reduce((result, element) => {
			const $element = $(element);

			if (!$element.data('selected')) {
				return result;
			}

			return result.concat($element.data('node-id'));
		}, []);

		const toSelect = without(selected, ...current);
		const toUnselect = difference(current, selected);

		toUnselect.forEach((id) => {
			const $element = $children.filter(`[data-node-id="${id}"]`);

			$element.removeData('selected');
			this.refreshNode($element);
		});

		toSelect.forEach((id) => {
			const $element = $children.filter(`[data-node-id="${id}"]`);

			$element.data({ selected: true });
			this.refreshNode($element);
		});
	}

	refreshNode($element) {
		refreshNode($element, this.classNames);
	}

	bindList() {
		this.$element.children().each((index, element) => {
			const $element = $(element);
			const id = $element.data('node-id');

			$element.data('node', this.index[id]);
		});
	}

	renderList() {
		const { classNames } = this;

		const html = this.list.map((node) => {
			return `<div
				data-node-id="${node.id}"
				class="${classNames.node}"
				title="${node.title}"
			>${
				getNodeHtml(node)
			}</div>`;
		}).join('');

		this.$element.html(html);
		this.bindList();
	}
}

module.exports = AvailableList;
