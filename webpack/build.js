const { Console } = require('console');
const webpack = require('webpack');
const createWebpackConfig = require('./create-build-config');
const stats = require('./stats');

const logger = new Console(process.stdout, process.stderr);

webpack(createWebpackConfig())
.run((err, result) => {
	if (err) {
		throw err;
	}

	logger.log(result.toString(stats));
});
