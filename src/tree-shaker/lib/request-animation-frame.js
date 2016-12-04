// https://gist.github.com/paulirish/1579671
/* eslint-env browser */

let lastTime = 0;
const REQUEST_TIMEOUT = 16;
const VENDORS = ['ms', 'moz', 'webkit', 'o'];

for (let idx = 0; idx < VENDORS.length && !window.requestAnimationFrame;
	idx += 1) {
	window.requestAnimationFrame = window[`${VENDORS[idx]}RequestAnimationFrame`];
	window.cancelAnimationFrame = window[`${VENDORS[idx]}CancelAnimationFrame`] ||
	window[`${VENDORS[idx]}CancelRequestAnimationFrame`];
}

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (callback) => {
		const currTime = new Date().getTime();
		const timeToCall = Math.max(0, REQUEST_TIMEOUT - (currTime - lastTime));
		const id = setTimeout(() => {
			callback(currTime + timeToCall);
		}, timeToCall);

		lastTime = currTime + timeToCall;

		return id;
	};
}

if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = (id) => {
		clearTimeout(id);
	};
}

module.exports = {
	cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
	requestAnimationFrame: window.requestAnimationFrame.bind(window),
};
