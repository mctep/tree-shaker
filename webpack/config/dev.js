const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const {
	HotModuleReplacementPlugin,
	NoErrorsPlugin,
} = webpack;

function basedir(...args) {
	return path.resolve(__dirname, ...args);
}

function projectRoot(...args) {
	return path.resolve(basedir('../..', ...args));
}

function makeEntry() {
	return [
		'webpack-hot-middleware/client',
		projectRoot('./example/index.js'),
	];
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
	}, {
		loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'],
		test: /\.css$/,
	}, {
		loaders: ['file-loader'],
		test: /\.json/,
	}];
}

function makeOutput() {
	return {
		filename: 'index.js',
		path: projectRoot('./build/dev-server'),
		publicPath: '/',
	};
}

function makePlugins() {
	return [
		new CleanWebpackPlugin([projectRoot('./build/dev-server')], {
			root: projectRoot('.'),
		}),

		new HtmlWebpackPlugin({
			favicon: projectRoot('./example/favicon.ico'),
			template: 'example/index.html.js',
		}),

		new HotModuleReplacementPlugin(),
		new NoErrorsPlugin(),
	];
}

function makeResolve() {
	return {
		mainFields: ['jsnext:main', 'main'],
		modules: ['src', 'node_modules'],
	};
}

module.exports = function createWebpackConfig() {
	return {
		context: projectRoot('.'),
		entry: makeEntry(),
		module: {
			loaders: makeLoaders(),
		},
		output: makeOutput(),
		plugins: makePlugins(),
		resolve: makeResolve(),
	};
};
