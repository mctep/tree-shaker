// eslint-disable-next-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');

module.exports = {
	plugins: [
		autoprefixer({
			browsers: [
				'Opera >= 15',
				'IE >= 9',
				'Firefox >= 2',
				'Safari >= 6',
				'Chrome >= 9',
			],
		}),
	],
};
