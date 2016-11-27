module.exports = function delegate($element, selector, event) {
	return (handler) => {
		$element.delegate(selector, event, handler);

		return () => {
			$element.undelegate(selector, event, handler);
		};
	};
};
