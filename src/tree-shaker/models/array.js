const without = require('lodash/without');
const includes = require('lodash/includes');
const uniq = require('lodash/uniq');
const Observable = require('lib/observable');

class ArrayModel extends Observable {
	toggle(item) {
		const { state } = this;

		if (includes(state, item)) {
			this.dispatch(without(state, item));
		} else {
			this.dispatch(state.concat(item));
		}
	}

	add(items) {
		const { state } = this;

		this.dispatch(uniq(state.concat(items)));
	}

	remove(items) {
		const { state } = this;

		this.dispatch(without(state, ...items));
	}
}

module.exports = ArrayModel;
