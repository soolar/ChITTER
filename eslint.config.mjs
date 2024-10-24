import typescriptEslint from '@typescript-eslint/eslint-plugin'
import libram from 'eslint-plugin-libram'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	{
		ignores: ['build', 'node_modules', 'KoLmafia'],
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			libram,
		},

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},

		rules: {
			'block-scoped-var': 'error',
			eqeqeq: 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'eol-last': 'error',
			'prefer-arrow-callback': 'error',
			'no-trailing-spaces': 'error',
			'prefer-template': 'error',

			'sort-imports': [
				'error',
				{
					ignoreCase: true,
					ignoreDeclarationSort: true,
				},
			],

			'node/no-unplublished-import': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'libram/verify-constants': 'error',
		},
	},
]
