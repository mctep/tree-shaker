const listeners = Symbol('listeners');

module.exports = class Observable {
	constructor(state) {
		this.state = state;
		this[listeners] = [];
	}

	setState(state) {
		this.state = state;
		this.dispatch();
	}

	subscribe(listener) {
		if (!this[listeners].includes(listener)) {
			this[listeners].push(listener);
		}

		return () => {
			this[listeners] = this[listeners].filter((existsListener) => {
				return existsListener !== listener;
			});
		};
	}

	dispatch() {
		this[listeners].forEach((listener) => {
			listener(this.state);
		});
	}
};
