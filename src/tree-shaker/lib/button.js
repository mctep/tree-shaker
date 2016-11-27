class Button {
	constructor() {
		const element = this.element = document.createElement('button');

		element.setAttribute('type', 'button');
		element.addEventListener('click', this.handleClick);
	}

	disable() {
		this.element.setAttribute('disabled', 'disabled');
	}

	enable() {
		this.element.removeAttribute('disabled');
	}

	content(html) {
		this.element.innerHTML = html;
	}

	handleClick() {
		if (!this.onClick) {
			return;
		}

		this.onClick();
	}
}

module.exports = Button;
