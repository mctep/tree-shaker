const includes = require('lodash/includes');

module.exports = class Observable {
	constructor(state) {
		this.state = state;
		this.listeners = [];
	}

	subscribe(listener) {
		if (!includes(this.listeners, listener)) {
			this.listeners.push(listener);
		}

		return () => {
			this.listeners = this.listeners.filter((existsListener) => {
				return existsListener !== listener;
			});
		};
	}

	dispatch(state) {
		const oldState = this.state;

		this.state = state;
		this.listeners.forEach((listener) => {
			listener(this.state, oldState);
		});
	}
};
