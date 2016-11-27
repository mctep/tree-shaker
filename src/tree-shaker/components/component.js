class Component {
	subscribe(subscriber, handler) {
		this.subscriptions = this.subscriptions || [];

		const unsubscribe = subscriber.subscribe
			? subscriber.subscribe(handler.bind(this))
			: subscriber(handler.bind(this));

		this.subscriptions.push(unsubscribe);
	}

	remove() {
		this.subscriptions.forEach((unsubscribe) => {
			unsubscribe();
		});
	}
}

module.exports = Component;
