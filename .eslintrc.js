module.exports = {
	extends: 'mctep',
	parser: 'babel-eslint',
	rules: {
		'id-length': ['error', { exceptions: ['id', '$', '_'] }],
		'no-extra-parens': ['error', 'all', { nestedBinaryExpressions: false }],
		'no-magic-numbers': ['error', { ignore: [0, 1, -1] }],
		'prefer-reflect': 'off',
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
