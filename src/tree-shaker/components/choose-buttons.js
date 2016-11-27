const $ = require('jquery');
const isEqual = require('lodash/isEqual');
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

		this.chosen = props.chosen;
		this.selected = props.selected;

		this.$element = $(`<div class="${classNames.buttons}"></div>`);
		this.$moveToChosenButton = $(getMoveToChosenButtonHtml(classNames));
		this.$moveFromChosenButton = $(getMoveFromChosenButtonHtml(classNames));

		this.$element.append(this.$moveToChosenButton);
		this.$element.append(this.$moveFromChosenButton);

		this.subscribe(this.chosen, this.handleStateChange.bind(this));
		this.subscribe(this.selected, this.handleStateChange.bind(this));

		this.subscribe(
			delegate(this.$element, '[data-move-chosen=from]', 'click'),
			() => { props.onMoveFromChosenClick(); }
		);

		this.subscribe(
			delegate(this.$element, '[data-move-chosen=to]', 'click'),
			() => { props.onMoveToChosenClick(); }
		);

		this.handleStateChange();
	}

	handleStateChange() {
		const selected = this.selected.state;
		const chosen = this.chosen.state;

		this.$moveFromChosenButton.attr({ disabled: true });
		this.$moveToChosenButton.attr({ disabled: true });

		if (!selected.length) {
			return;
		}

		if (isEqual(selected, chosen)) {
			this.$moveFromChosenButton.attr({ disabled: false });
			this.$moveToChosenButton.attr({ disabled: true });
		} else {
			this.$moveFromChosenButton.attr({ disabled: true });
			this.$moveToChosenButton.attr({ disabled: false });
		}
	}
}

module.exports = ChooseButtons;
