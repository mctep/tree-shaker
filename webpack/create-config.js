const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const {
	HotModuleReplacementPlugin,
	NoErrorsPlugin,
} = webpack;

const {
  UglifyJsPlugin,
} = webpack.optimize;

function basedir(...args) {
	return path.resolve(__dirname, ...args);
}

function projectRoot(...args) {
	return path.resolve(basedir('../', ...args));
}

function makeEntry({ environment }) {
	const development = environment === 'development';

	if (development) {
		return [
			'webpack-hot-middleware/client',
			projectRoot('./src/index.js'),
		];
	}

	return projectRoot('./src/index.js');
}

function makeLoaders() {
	return [{
		exclude: [/node_modules/],
		loader: 'babel-loader',
		query: {
			presets: [['babel-preset-modern-browsers', {
				loose: true,
				modules: false,
			}]],
		},
		test: /\.js$/,
	}];
}

function makeOutput({ environment }) {
	const development = environment === 'development';

	return {
		filename: development
			? 'index.js'
			: '[hash].js',
		path: projectRoot('./build'),
		publicPath: '/',
	};
}

function makePlugins({ environment }) {
	const development = environment === 'development';

	const plugins = [
		new CleanWebpackPlugin([projectRoot('./build')], {
			root: projectRoot('.'),
		}),

		new HtmlWebpackPlugin({
			template: 'src/index.html.js',
		}),
	];

	if (development) {
		plugins.push(new HotModuleReplacementPlugin());
		plugins.push(new NoErrorsPlugin());
	} else {
		plugins.push(new UglifyJsPlugin());
	}

	return plugins;
}

function makeResolve() {
	return {
		mainFields: ['jsnext:main', 'main'],
		modules: ['src', 'node_modules'],
	};
}

module.exports = function createWebpackConfig(options) {
	return {
		context: projectRoot('.'),
		entry: makeEntry(options),
		module: {
			loaders: makeLoaders(),
		},
		output: makeOutput(options),
		plugins: makePlugins(options),
		resolve: makeResolve(),
	};
};
