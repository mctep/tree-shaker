module.exports = function classnames(object) {
	return Object.keys(object).map((className) => {
		return object[className] && className;
	}).filter(Boolean)
	.join(' ');
};
