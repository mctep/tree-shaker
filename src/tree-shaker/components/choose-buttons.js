const $ = require('jquery');
const Component = require('./component');
const delegate = require('lib/jquery-delegate-observable');

function getMoveToChosenButtonHtml(classNames) {
	return `<button type="button"
		data-move-chosen="to" class="${classNames.moveToChosen}">-&gt;</button>`;
}

function getMoveFromChosenButtonHtml(classNames) {
	return `<button type="button"
		data-move-chosen="from"
		class="${classNames.moveFromChosen}">&lt;-</button>`;
}

class ChooseButtons extends Component {
	constructor(props) {
		super();

		const classNames = this.classNames = {
			buttons: 'choose-buttons',
			moveFromChosen: 'button button-move-from-chosen',
			moveToChosen: 'button button-move-to-chosen',
		};

		this.props = {};
		this.props.availableSelected = props.availableSelected;
		this.props.chosenSelected = props.chosenSelected;

		this.$element = $(`<div class="${classNames.buttons}"></div>`);
		this.$moveToChosenButton = $(getMoveToChosenButtonHtml(classNames));
		this.$moveFromChosenButton = $(getMoveFromChosenButtonHtml(classNames));

		this.$element.append(this.$moveToChosenButton);
		this.$element.append(this.$moveFromChosenButton);

		this.subscribe(this.props.availableSelected,
				this.handleAvailableChange.bind(this));
		this.subscribe(this.props.chosenSelected,
				this.handleChosenChange.bind(this));

		this.subscribe(
			delegate(this.$element, '[data-move-chosen=from]', 'click'),
			() => { props.onMoveFromChosenClick(); }
		);

		this.subscribe(
			delegate(this.$element, '[data-move-chosen=to]', 'click'),
			() => { props.onMoveToChosenClick(); }
		);

		this.handleAvailableChange(this.props.availableSelected.state);
		this.handleChosenChange(this.props.chosenSelected.state);
	}

	handleAvailableChange(selected) {
		this.$moveToChosenButton.attr({ disabled: !selected.length });
	}

	handleChosenChange(selected) {
		this.$moveFromChosenButton.attr({ disabled: !selected.length });
	}
}

module.exports = ChooseButtons;
