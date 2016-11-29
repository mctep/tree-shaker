const $ = require('jquery');
const without = require('lodash/without');
const difference = require('lodash/difference');
const Component = require('./component');
const getAncestorsCount = require('lib/get-ancestors-count');
const delegate = require('lib/jquery-delegate-observable');

class AvailableList extends Component {
	constructor(props) {
		super();

		this.classNames = {
			disabled: 'disabled',
			list: 'list list-available',
			node: 'node node-available',
			selected: 'selected',
		};

		this.$element = $(`<div class=${this.classNames.list}></div>`);

		this.props = {};

		this.props.list = props.list;
		this.props.index = props.index;
		this.props.disabled = props.disabled;
		this.props.selected = props.selected;
		this.props.onSelect = props.onSelect;

		this.subscribe(
			delegate(this.$element, '[data-node-id]', 'click'),
			this.handleNodeClick
		);

		// this.subscribe(this.props.list, this.handleListChange);
		this.subscribe(this.props.selected, this.handleSelectedChange);
		this.subscribe(this.props.disabled, this.handleDisabledChange);

		this.renderList();
	}

	handleNodeClick(event) {
		const $element = $(event.target);
		const id = $element.data('node-id');
		const disabled = this.props.disabled.state;

		if (disabled.includes(id)) {
			return;
		}

		this.props.onSelect(id);
	}

	handleSelectedChange(current, prev) {
		const mutation = getArrayMutation(current, prev);

		mutation.toRemove.forEach((id) => {
			this.refreshNodeById(id, { selected: false });
		});

		mutation.toAdd.forEach((id) => {
			this.refreshNodeById(id, { selected: true });
		});
	}

	handleDisabledChange(current, prev) {
		const mutation = getArrayMutation(current, prev);

		mutation.toRemove.forEach((id) => {
			this.refreshNodeById(id, { disabled: false });
		});

		mutation.toAdd.forEach((id) => {
			this.refreshNodeById(id, { disabled: true });
		});
	}

	refreshNodeById(id, data) {
		const $element = this.$element.children(`[data-node-id=${id}]`);

		$element.data(data);
		this.refreshNode($element);
	}

	refreshNode($element) {
		refreshNode($element, this.classNames);
	}

	bindList() {
		this.$element.children().each((index, element) => {
			const $element = $(element);
			const id = $element.data('node-id');

			$element.data('node', this.props.index[id]);
		});
	}

	renderList() {
		const { classNames } = this;

		const html = this.props.list.state.map((node) => {
			return getNodeHtml(node, classNames);
		}).join('');

		this.$element.html(html);
		this.bindList();
	}
}

module.exports = AvailableList;

function getNodeHtml(node, classNames) {
	return `<div
		data-node-id="${node.id}"
		class="${classNames.node}"
		title="${node.title}"
	>${
		getNodeContentHtml(node)
	}</div>`;
}

function getNodeContentHtml(node) {
	const { id, title } = node;
	let ancestorsCount = getAncestorsCount(node);
	let padding = '';

	while (ancestorsCount) {
		padding += '&nbsp';
		ancestorsCount -= 1;
	}

	return `${padding}#${id} ${title}`;
}

function getArrayMutation(current, prev) {
	const toAdd = without(current, ...prev);
	const toRemove = difference(prev, current);

	return { toAdd, toRemove };
}

function refreshNode($element, classNames) {
	$element.toggleClass(classNames.selected, Boolean($element.data('selected')));
	$element.toggleClass(classNames.disabled, Boolean($element.data('disabled')));
}
