/* eslint-env browser */

function getIEVersion(_userAgent) {
	const userAgent = _userAgent || (window && navigator.userAgent.toLowerCase());

	if (!userAgent) {
		return null;
	}

	if (userAgent.indexOf('msie') === -1) {
		return null;
	}

	return parseInt(userAgent.split('msie')[1], 10);
}

module.exports = getIEVersion;
