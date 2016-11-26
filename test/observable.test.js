const { expect } = require('chai');
const sinon = require('sinon');
const Observable = require('tree-shaker/lib/observable');

describe('Observable', () => {
	beforeEach(function() {
		this.state = {};
		this.listener = sinon.stub();
		this.observable = new Observable(this.state);
		this.unsubscribe = this.observable.subscribe(this.listener);
	});

	it('should have subscribe method', function() {
		expect(this.observable.subscribe).to.be.a('function');
	});

	it('should have dispatch method', function() {
		expect(this.observable.dispatch).to.be.a('function');
	});

	it('unsubscribe should be a function', function() {
		expect(this.unsubscribe).to.be.a('function');
	});

	describe('listener should be called once', () => {
		it('on calling dispatch method ', function() {
			this.observable.dispatch();
			expect(this.listener.calledOnce).to.be.ok;
		});

		it('after subscribe repeat', function() {
			this.observable.dispatch();
			this.observable.subscribe(this.listener);
			expect(this.listener.calledOnce).to.be.ok;
		});
	});

	it('listener should not be called after unsbuscribe', function() {
		this.unsubscribe();
		this.observable.dispatch();
		expect(this.listener.called).not.to.be.ok;
	});

	it('listener should be called with state arg', function() {
		this.observable.dispatch();
		expect(this.listener.firstCall.args[0]).to.be.equal(this.state);
	});

	describe('second listener', () => {
		beforeEach(function() {
			this.secondListener = sinon.stub();
			this.secondUsubscribe = this.observable.subscribe(this.secondListener);
		});

		it('both listeners should be called once', function() {
			this.observable.dispatch();
			expect(this.listener.calledOnce).to.be.ok;
			expect(this.secondListener.calledOnce).to.be.ok;
		});

		it('only second listener should be called once after first unsubscribe',
		function() {
			this.unsubscribe();
			this.observable.dispatch();
			expect(this.listener.called).not.to.be.ok;
			expect(this.secondListener.calledOnce).to.be.ok;
		});
	});
});
