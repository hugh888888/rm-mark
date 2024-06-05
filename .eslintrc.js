module.exports = {
	extends: ['@eslint-sets/ts'],
	rules: {
		camelcase: 0,
		'vue/multi-word-component-names': 1,
		'vue/no-mutating-props': 2,
		'jsdoc/require-param': 0,
		'linebreak-style': [1, 'unix'],
		'vue/component-definition-name-casing': 0
	},
	globals: {
		Vue: true,
		wx: 'readonly',
		jWeixin: 'readonly',
		WWOpenData: 'readonly'
	}
}
