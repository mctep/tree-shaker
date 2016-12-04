const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { UglifyJsPlugin } = webpack.optimize;

function basedir(...args) {
	return path.resolve(__dirname, ...args);
}

function projectRoot(...args) {
	return path.resolve(basedir('../..', ...args));
}

function makeEntry() {
	return projectRoot('./src/tree-shaker-theme/index.js');
}

function makeExternals() {
	return {
		jquery: 'jQuery',
		lodash: '_',
		'tree-shaker': 'TreeShaker',
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
	}, {
		loader: ExtractTextPlugin.extract({
			fallbackLoader: 'style-loader',
			loader: 'css-loader?importLoaders=1&minimize!postcss-loader',
		}),
		test: /\.css$/,
	}];
}

function makeOutput() {
	return {
		filename: 'tree-shaker-theme.min.js',
		library: 'TreeShakerTheme',
		libraryTarget: 'umd',
		path: projectRoot('./build/theme'),
		publicPath: './',
	};
}

function makePlugins() {
	return [
		new CleanWebpackPlugin([projectRoot('./build/theme')], {
			root: projectRoot('.'),
		}),

		new ExtractTextPlugin('tree-shaker-theme.min.css'),
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
