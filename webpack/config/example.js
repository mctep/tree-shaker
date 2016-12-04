const path = require('path');

// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function basedir(...args) {
	return path.resolve(__dirname, ...args);
}

function projectRoot(...args) {
	return path.resolve(basedir('../..', ...args));
}

function makeEntry() {
	return projectRoot('./example/index.js');
}

function makeExternals() {
	return {
		jquery: 'jQuery',
		lodash: '_',
		'tree-shaker': 'TreeShaker',
		'tree-shaker-theme': 'TreeShakerTheme',
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
			loader: 'css-loader?importLoaders=1!postcss-loader',
		}),
		test: /\.css$/,
	}, {
		loaders: ['file-loader'],
		test: /\.json/,
	}];
}

function makeOutput() {
	return {
		filename: 'index.js',
		library: 'TreeShakerExample',
		libraryTarget: 'umd',
		path: projectRoot('./build/example'),
		publicPath: './',
	};
}

function makePlugins() {
	return [
		new CleanWebpackPlugin([projectRoot('./build/example')], {
			root: projectRoot('.'),
		}),

		new HtmlWebpackPlugin({
			environment: 'production',
			favicon: projectRoot('./example/favicon.ico'),
			template: 'example/index.html.js',
		}),

		new ExtractTextPlugin('example.css'),
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
