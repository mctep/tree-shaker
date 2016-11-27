class Component {
	constructor() {
		this.createElement();
		this.subscribtions = [];
		this.children = [];
	}

	createElement() {
		const { tag = 'div' } = this;

		this.element = document.createElement(tag);
		this.element.component = this;
	}

	addChild(component) {
		this.element.appendChild(component.element);
		this.children.push(component);
	}

	removeChild(component) {
		component.dispose();
		this.element.removeChild(component.element);
		this.children = this.children.filter((child) => {
			return component !== child;
		});
	}

	attrs(attrs) {
		Object.keys(attrs).forEach((key) => {
			const value = attrs[key];

			if (value) {
				this.element.setAttribute(key, value);
			} else {
				this.element.removeAttribute(key);
			}
		});
	}

	subscribe(observer, listener) {
		const unsubscribe = observer.subscribe(listener.bind(this));

		this.subscribtions.push(unsubscribe);

		return unsubscribe;
	}

	addEventListener(name, listener) {
		const bindedListener = listener.bind(this);

		this.element.addEventListener(name, bindedListener);

		const unsubscribe = () => {
			this.element.removeListener(name, bindedListener);
		};

		this.subscribtions.push(unsubscribe);

		return unsubscribe;
	}

	dispose() {
		this.subscribtions.forEach((unsubscribe) => {
			unsubscribe();
		});

		this.children.forEach((child) => {
			child.dispose();
			this.element.removeChild(child.element);
		});
	}
}

module.exports = Component;
