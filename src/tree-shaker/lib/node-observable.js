const Observable = require('./observable');

const setProperty = Symbol('setProperty');

class NodeObservable extends Observable {
	constructor(state) {
		super(state);

		this[setProperty] = (key, prop) => {
			state[key] = prop;
			this.dispatch();
		};
	}

	toggleSelect() {
		const { selected } = this.state;

		this[setProperty]('selected', !selected);
	}

	toggleMoved() {
		const { moved } = this.state;

		this[setProperty]('moved', !moved);
	}
}

module.exports = NodeObservable;
