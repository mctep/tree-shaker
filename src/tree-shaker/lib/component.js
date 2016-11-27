class Component {
	constructor(store, selector) {
		this.store = store;
		this.handleStateUpdate = this.handleStateUpdate.bind(this);
		this.selector = selector.bind(this);

		this.createElement();

		this.unsubscribe = store.subscribe(this.handleStateUpdate);
		this.handleStateUpdate(store.state);
	}

	handleStateUpdate(state) {
		this.render(this.selector(state));
	}

	dispose() {
		this.unsubscribe();
	}
}

module.exports = Component;
