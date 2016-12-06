const _ = require('lodash');
const $ = require('jquery');
const escapeHtml = require('./lib/escape-html');
const classNames = require('./styles');
const { Tree } = require('tree-shaker');

function getPad(ancestors) {
	return _.map(ancestors, () => {
		return '&nbsp;&nbsp;';
	}).join('');
}

function getAncestorsAccordion(option) {
	const visibleAncestors = [];

	const parentId = option.parent && option.parent.id;

	const ancestors = Tree.getAncestors(option.data.availableNode);
	const ancestorsLength = ancestors.length;

	for (let idx = 0; idx < ancestorsLength; idx += 1) {
		const ancestor = ancestors[idx];

		if (ancestor.id === parentId) {
			break;
		}

		visibleAncestors.push(ancestor);
	}

	return visibleAncestors.reverse().map((ancestor) => {
		return `<span class="${classNames.select.optionAncestor}">${
			escapeHtml(ancestor.data.name)
		}</span>`;
	}).join('');
}

function chosenOptionTemplate(option) {
	let chosenAncestors = Tree.getAncestors(option).reverse();

	chosenAncestors.shift();
	const { availableNode } = option.data;
	const { name } = availableNode.data;
	const $pad = $('<span></span>').html(getPad(chosenAncestors));
	const $ancestors = $('<span></span>').html(
		getAncestorsAccordion(option)
	);

	return $('<div></div>')
	.attr('title', name)
	.text(name)
	.prepend($ancestors)
	.prepend($pad)
	.data('update', update);

	function update(updatedOption) {
		const updatedAncestors = Tree.getAncestors(updatedOption).reverse();

		updatedAncestors.shift();
		if (updatedAncestors.length === chosenAncestors.length) {
			return;
		}

		chosenAncestors = updatedAncestors;

		$pad.html(getPad(chosenAncestors));
		$ancestors.html(
			getAncestorsAccordion(updatedOption)
		);
	}
}

module.exports = chosenOptionTemplate;
