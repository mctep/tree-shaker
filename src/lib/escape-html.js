const entityMap = {
	'"': '&quot;',
	'&': '&amp;',
	'\'': '&#39;',
	'/': '&#x2F;',
	'<': '&lt;',
	'>': '&gt;',
};

module.exports = function escapeHtml(string) {
	return String(string).replace(/[&<>"'/]/g, (key) => {
		return entityMap[key];
	});
};
