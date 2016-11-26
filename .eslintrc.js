module.exports = {
	extends: 'mctep',
	parser: 'babel-eslint',
	rules: {
		'id-length': ['error', { exceptions: ['id'] }],
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
