const $ = require('jquery');
const cn = require('lib/classnames');

module.exports = function assembleElements(elements, classNames) {
	const {
		$availableSelect,
		$chosenSelect,
		$filterInput,
		$moveDownButton,
		$moveToChosenButton,
		$moveUpButton,
		$removeFromChosenButton,
	} = elements;

	const $element =
	$(`<div class="${cn(classNames.container)}"></div>`);

	const $filterInputContainer =
	$(`<div class="${cn(classNames.filter.container)}"></div>`);

	const $availableColumn =
	$(`<div class="${cn(classNames.columnAvailable)}"></div>`);
	const $chosenColumn =
	$(`<div class="${cn(classNames.columnChosen)}"></div>`);

	const $movingButtonsContainer =
	$(`<div class="${cn(classNames.buttonsMove.container)}"></div>`);
	const $movingButtonsContent =
	$(`<div class="${cn(classNames.buttonsMove.content)}"></div>`);

	const $sortingButtonsContainer =
	$(`<div class="${cn(classNames.buttonsSort.container)}"></div>`);
	const sortingButtonsContent =
	$(`<div class="${cn(classNames.buttonsSort.content)}"></div>`);

	return $element
	.append($availableColumn
		.append($filterInputContainer
			.append($filterInput)
		)
		.append($availableSelect)
		.append($movingButtonsContainer
			.append($movingButtonsContent
				.append($moveToChosenButton)
				.append($removeFromChosenButton)
			)
		)
	)
	.append($chosenColumn
		.append($chosenSelect)
		.append($sortingButtonsContainer
			.append(sortingButtonsContent
				.append($moveUpButton)
				.append($moveDownButton)
			)
		)
	);
};
