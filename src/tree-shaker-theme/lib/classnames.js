const _ = require('lodash');

module.exports = function classnames(...args) {
	const object = {};

	args.forEach((arg) => {
		if (typeof arg === 'string') {
			object[arg] = true;
		}

		if (typeof arg === 'object') {
			_.assign(object, arg);
		}
	});

	// console.log(object);

	return _.map(object, (available, className) => {
		return available && className;
	}).filter(Boolean).join(' ');
};
