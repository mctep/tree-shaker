/* eslint-env browser */

function checkStorage(storage) {
	if (typeof storage === 'undefined') {
		return false;
	}

	try {
		storage.setItem('storage', '');
		storage.getItem('storage');
		storage.removeItem('storage');

		return true;
	} catch (err) {
		return false;
	}
}

let storage = null;

if (checkStorage(window.sessionStorage)) {
	storage = window.sessionStorage;
} else if (checkStorage(window.localStorage)) {
	storage = window.localStorage;
} else {
	let data = {};

	storage = {
		clear() {
			data = {};
			Storage.length = 0;
		},

		getItem(key) {
			return data[key];
		},

		removeItem(key) {
			delete data[key];
		},

		setItem(key, value) {
			data[key] = String(value);
		},
	};
}

module.exports = storage;
