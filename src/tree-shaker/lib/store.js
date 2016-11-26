const listeners = Symbol('listeners');

module.exports = class Store {
	constructor(getState) {
		this.getState = getState;
		this[listeners] = [];
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
			listener(this.getState);
		});
	}
};
