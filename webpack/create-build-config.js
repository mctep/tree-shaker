const path = require('path');

// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// const {
//   UglifyJsPlugin,
// 	CommonsChunkPlugin,
// } = webpack.optimize;

const exampleStyles = new ExtractTextPlugin('example.css');
const treeShakerStyles = new ExtractTextPlugin('tree-shaker-theme.css');

function basedir(...args) {
	return path.resolve(__dirname, ...args);
}

function projectRoot(...args) {
	return path.resolve(basedir('../', ...args));
}

function makeEntry() {
	return {
		example: projectRoot('./examples/index.js'),
		'tree-shaker': [projectRoot('./src/tree-shaker/index.js')],
		'tree-shaker-theme': [projectRoot('./src/tree-shaker-theme/index.js')],
	};
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
	}, {
		loader: treeShakerStyles.extract({
			fallbackLoader: 'style-loader',
			loader: 'css-loader?importLoaders=1!postcss-loader',
		}),
		test: /tree-shaker.*\.css$/,
	}, {
		loader: exampleStyles.extract({
			fallbackLoader: 'style-loader',
			loader: 'css-loader?importLoaders=1!postcss-loader',
		}),
		test: /example.*\.css$/,
	}, {
		loaders: ['json-loader'],
		test: /\.json/,
	}];
}

function makeOutput() {
	return {
		filename: '[name].js',
		library: 'TreeShaker',
		libraryTarget: 'umd',
		path: projectRoot('./build'),
		publicPath: '/',
	};
}

function makePlugins() {
	return [
		new CleanWebpackPlugin([projectRoot('./build')], {
			root: projectRoot('.'),
		}),

		// new UglifyJsPlugin(),
		new HtmlWebpackPlugin({
			template: 'examples/index.html.js',
		}),
		exampleStyles,
		treeShakerStyles,
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
		externals: makeExternals(),
		module: {
			loaders: makeLoaders(),
		},
		output: makeOutput(),
		plugins: makePlugins(),
		resolve: makeResolve(),
	};
};
