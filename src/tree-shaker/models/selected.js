const without = require('lodash/without');
const includes = require('lodash/includes');
const Observable = require('lib/observable');

class SelectedModel extends Observable {
	toggle(id) {
		const { state } = this;

		if (includes(state, id)) {
			this.dispatch(without(state, id));
		} else {
			this.dispatch(state.concat(id));
		}
	}
}

module.exports = SelectedModel;
