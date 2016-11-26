const { expect } = require('chai');
const sinon = require('sinon');
const Store = require('tree-shaker/lib/store');

describe('Store', () => {
	beforeEach(function() {
		this.getState = sinon.stub();
		this.listener = sinon.stub();
		this.store = new Store(this.getState);
		this.unsubscribe = this.store.subscribe(this.listener);
	});

	it('should have subscribe method', function() {
		expect(this.store.subscribe).to.be.a('function');
	});

	it('should have dispatch method', function() {
		expect(this.store.dispatch).to.be.a('function');
	});

	it('unsubscribe should be a function', function() {
		expect(this.unsubscribe).to.be.a('function');
	});

	describe('listener should be called once', () => {
		it('on calling dispatch method ', function() {
			this.store.dispatch();
			expect(this.listener.calledOnce).to.be.ok;
		});

		it('after subscribe repeat', function() {
			this.store.dispatch();
			this.store.subscribe(this.listener);
			expect(this.listener.calledOnce).to.be.ok;
		});
	});

	it('listener should not be called after unsbuscribe', function() {
		this.unsubscribe();
		this.store.dispatch();
		expect(this.listener.called).not.to.be.ok;
	});

	it('listener should be called with getState arg', function() {
		this.store.dispatch();
		expect(this.listener.firstCall.args[0]).to.be.equal(this.getState);
	});

	describe('second listener', () => {
		beforeEach(function() {
			this.secondListener = sinon.stub();
			this.secondUsubscribe = this.store.subscribe(this.secondListener);
		});

		it('both listeners should be called once', function() {
			this.store.dispatch();
			expect(this.listener.calledOnce).to.be.ok;
			expect(this.secondListener.calledOnce).to.be.ok;
		});

		it('only second listener should be called once after first unsubscribe',
		function() {
			this.unsubscribe();
			this.store.dispatch();
			expect(this.listener.called).not.to.be.ok;
			expect(this.secondListener.calledOnce).to.be.ok;
		});
	});
});
