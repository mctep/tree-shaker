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

		this.subscribe(this.props.list, this.handleListChange);
		this.subscribe(this.props.selected, this.handleSelectedChange);
		this.subscribe(this.props.disabled, this.handleDisabledChange);

		this.renderList();
	}

	handleNodeClick(event) {
		const $element = $(event.target);
		const id = $element.data('node-id').toString();
		const disabled = this.props.disabled.state;

		if (disabled.includes(id)) {
			return;
		}

		this.props.onSelect(id);
	}

	handleListChange(current, prev) {
		const mutation = getArrayMutation(current, prev);

		mutation.toRemove.forEach(this.removeElementById.bind(this));
		mutation.toAdd.forEach(this.insertElementById.bind(this));
	}

	handleSelectedChange(current, prev) {
		const mutation = getArrayMutation(current, prev);

		mutation.toRemove.forEach((id) => {
			this.refreshElementById(id, { selected: false });
		});

		mutation.toAdd.forEach((id) => {
			this.refreshElementById(id, { selected: true });
		});
	}

	handleDisabledChange(current, prev) {
		const mutation = getArrayMutation(current, prev);

		mutation.toRemove.forEach((id) => {
			this.refreshElementById(id, { disabled: false });
		});

		mutation.toAdd.forEach((id) => {
			this.refreshElementById(id, { disabled: true });
		});
	}

	getElementById(id) {
		const $element = this.$element.children(`[data-node-id=${id}]`);

		return $element.length
			? $element
			: null;
	}

	refreshElementById(id, data) {
		const $element = this.$element.children(`[data-node-id=${id}]`);

		$element.data(data);
		this.refreshElement($element);
	}

	removeElementById(id) {
		this.getElementById(id).remove();
	}

	insertElementById(id) {
		const node = this.props.index[id];
		const $element = this.getElementById(id) || $(this.getElementHtml(id));
		const indexInList = this.props.list.state.indexOf(node.id);

		if (indexInList < 0) {
			throw new Error('Could not create element for node that is not in list');
		}

		if (indexInList === 0) {
			return $element.prependTo(this.$element);
		}

		const siblingId = this.props.list.state[indexInList - 1];

		return $element.insertAfter(this.getElementById(siblingId));
	}

	getElementHtml(id) {
		return getElementHtml(this.props.index[id], this.classNames);
	}

	refreshElement($element) {
		refreshElement($element, this.classNames);
	}

	renderList() {
		const { classNames } = this;

		const html = this.props.list.state.map((id) => {
			return this.getElementHtml(id, classNames);
		}).join('');

		this.$element.html(html);
	}
}

module.exports = AvailableList;

function getElementHtml(node, classNames) {
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

function refreshElement($element, classNames) {
	$element.toggleClass(classNames.selected, Boolean($element.data('selected')));
	$element.toggleClass(classNames.disabled, Boolean($element.data('disabled')));
}
