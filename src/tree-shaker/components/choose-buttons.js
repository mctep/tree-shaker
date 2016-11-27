const Component = require('./component');
const ChooseButton = require('./choose-button');

class ChooseButtons extends Component {
	constructor(options) {
		super();

		this.options = options;

		const moveToChoosenButton = new ChooseButton({
			selected: options.selected,
		});

		moveToChoosenButton.element.innerHTML = '-&gt;';

		const moveFromChoosenButton = new ChooseButton({
			selected: options.selected,
		});

		moveFromChoosenButton.element.innerHTML = '&lt;-';

		this.addChild(moveToChoosenButton);
		this.addChild(moveFromChoosenButton);
	}
}

module.exports = ChooseButtons;
