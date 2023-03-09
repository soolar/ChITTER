/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge')

const sharedConfig = {
	mode: 'production',
	optimization: {
		minimize: false,
	},
	performance: {
		hints: false,
	},
	devtool: false,
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				loader: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [new MiniCssExtractPlugin()],
	externals: {
		kolmafia: 'commonjs kolmafia',
	},
}

const otherRelayConfig = merge(
	{
		entry: './src/relay/relay_ChITTER.ts',
		output: {
			path: path.resolve(__dirname, 'KoLmafia', 'relay'),
			filename: 'relay_ChITTER.js',
			libraryTarget: 'commonjs',
		},
		module: {
			rules: [
				{
					test: /\.(t|j)sx?$/,
					loader: 'babel-loader',
				},
			],
		},
	},
	sharedConfig
)

const changeFavRelayConfig = merge(
	{
		entry: './src/relay/chitter_changeFav.ts',
		output: {
			path: path.resolve(__dirname, 'KoLmafia', 'relay'),
			filename: 'chitter_changeFav.js',
			libraryTarget: 'commonjs',
		},
		module: {
			rules: [
				{
					test: /\.(t|j)sx?$/,
					loader: 'babel-loader',
				},
			],
		},
	},
	sharedConfig
)

const relayConfig = merge(
	{
		entry: './src/browser/index.tsx',
		output: {
			path: path.resolve(__dirname, 'KoLmafia', 'relay', 'ChITTER'),
			filename: 'ChITTER.js',
			libraryTarget: 'commonjs',
		},
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					loader: 'babel-loader',
					options: { presets: ['@babel/env', '@babel/preset-react'] },
				},
			],
		},
	},
	sharedConfig
)

module.exports = [otherRelayConfig, changeFavRelayConfig, relayConfig]
