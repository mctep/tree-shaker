const _ = require('lodash');
const Observable = require('./observable');

class ArrayModel extends Observable {
	toggle(items) {
		const { state } = this;

		items.forEach((item) => {
			if (_.includes(state, item)) {
				this.dispatch(_.without(state, item));
			} else {
				this.dispatch(state.concat(item));
			}
		});
	}

	add(items) {
		const { state } = this;

		this.dispatch(_.uniq(state.concat(items)));
	}

	remove(items) {
		const { state } = this;

		this.dispatch(_.without(state, ...items));
	}

	set(items) {
		this.dispatch(items);
	}

	replace(needle, updated) {
		this.dispatch(this.state.map((item) => {
			if (item === needle) {
				return updated;
			}

			return item;
		}));
	}
}

module.exports = ArrayModel;
