const { expect } = require('chai');
const TreeShaker = require('tree-shaker');

// just for full coverage report
it('tree shaker should be a function', () => {
	expect(TreeShaker).to.be.a('function');
});
