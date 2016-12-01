module.exports = {
	extends: 'mctep',
	parser: 'babel-eslint',
	rules: {
		'id-length': ['error', { exceptions: ['id', '$', '_'] }],
		'no-magic-numbers': ['error', { ignore: [0, 1, -1] }],
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js'],
				moduleDirectory: ['node_modules', 'src'],
			},
		},
	},
};
