const Component = require('./component');

class Button extends Component {
	tag = 'button';

	constructor() {
		super();
		this.attrs({ type: 'button' });
	}

	setDisabled(disabled) {
		this.attrs({ disabled });
	}
}

module.exports = Button;
