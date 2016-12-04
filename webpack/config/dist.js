const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { UglifyJsPlugin } = webpack.optimize;

function basedir(...args) {
	return path.resolve(__dirname, ...args);
}

function projectRoot(...args) {
	return path.resolve(basedir('../..', ...args));
}

function makeEntry() {
	return projectRoot('./src/tree-shaker/index.js');
}

function makeExternals() {
	return {
		jquery: 'jQuery',
		lodash: '_',
	};
}

function makeLoaders() {
	return [{
		exclude: [/node_modules/],
		loader: 'babel-loader',

		query: {
			presets: [['babel-preset-es2015', {
				modules: false,
			}]],
		},
		test: /\.js$/,
	}];
}

function makeOutput() {
	return {
		filename: 'tree-shaker.min.js',
		library: 'TreeShaker',
		libraryTarget: 'umd',
		path: projectRoot('./build/dist'),
		publicPath: '/',
	};
}

function makePlugins() {
	return [
		new CleanWebpackPlugin([projectRoot('./build/dist')], {
			root: projectRoot('.'),
		}),

		new UglifyJsPlugin(),
	];
}

module.exports = function createWebpackConfig() {
	return {
		context: projectRoot('.'),
		entry: makeEntry(),
		externals: makeExternals(),
		module: {
			loaders: makeLoaders(),
		},
		output: makeOutput(),
		plugins: makePlugins(),
	};
};
