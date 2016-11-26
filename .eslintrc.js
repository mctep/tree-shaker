module.exports = {
	extends: 'mctep',
	parser: 'babel-eslint',
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js'],
				moduleDirectory: ['node_modules', 'src'],
			},
		},
	},
};
