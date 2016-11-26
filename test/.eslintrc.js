module.exports = {
	env: {
		mocha: true,
	},

	rules: {
		'func-names': 'off',
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'max-nested-callbacks': 'off',
		'no-invalid-this': 'off',
		'no-magic-numbers': 'off',
		'no-unused-expressions': 'off',
	},
};
