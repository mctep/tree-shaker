const _ = require('lodash');
const $ = require('jquery');
const escapeHtml = require('./lib/escape-html');
const { Tree } = require('tree-shaker');

function getPad(option) {
	const ancestors = Tree.getAncestors(option).reverse();

	ancestors.shift();

	return _.map(ancestors, () => {
		return '&nbsp;&nbsp;';
	}).join('');
}

function getAncestorsAccordion(option) {
	const ancestors = Tree.getAncestors(option);

	ancestors.pop();

	let html = '';

	ancestors.forEach((ancestor) => {
		html += `<div class="ancestor">${escapeHtml(ancestor.data.name)}`;
	});

	ancestors.forEach(() => {
		html += '</div>';
	});

	return html;
}

function getElement(option) {
	const { data } = option.data.availableNode;

	const name = escapeHtml(data.name);
	const pad = getPad(option);

	const acc = getAncestorsAccordion(option.data.availableNode);

	return $(`<div title="${name}">${acc}${pad} ${name}</div>`);
}

function updateElement(option, $element) {
	const { data } = option.data.availableNode;

	const name = escapeHtml(data.name);
	const pad = getPad(option);

	const acc = getAncestorsAccordion(option.data.availableNode);

	return $element.replaceWith(
		$(`<div title="${name}">${acc}${pad} ${name}</div>`)
	);
}

module.exports = { getElement, updateElement };
