const Button = require('./button');

class ChooseButton extends Button {
	constructor(options) {
		super();

		this.options = options;
		const { selected } = options;

		this.subscribe(selected, this.handleSelectedChanged);
	}

	handleSelectedChanged(selected) {
		this.attrs({
			disabled: !selected.length,
		});
	}
}

module.exports = ChooseButton;
