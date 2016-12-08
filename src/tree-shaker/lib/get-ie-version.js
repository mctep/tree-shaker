/* eslint-env browser */

// eslint-disable-next-line complexity
function getIEVersion(_userAgent) {
	const userAgent = _userAgent || (window && navigator.userAgent.toLowerCase());
	const IE11 = 11;

	if (Boolean(window.MSInputMethodContext) && Boolean(document.documentMode)) {
		return IE11;
	}

	if (!userAgent) {
		return null;
	}

	if (userAgent.indexOf('msie') === -1) {
		return null;
	}

	return parseInt(userAgent.split('msie')[1], 10);
}

module.exports = getIEVersion;
