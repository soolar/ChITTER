/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const { merge } = require("webpack-merge");

const sharedConfig = {
	mode: "production",
	optimization: {
		minimize: false,
	},
	performance: {
		hints: false,
	},
	devtool: false,
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
	},
	externals: {
		kolmafia: "commonjs kolmafia",
	}
};

const otherRelayConfig = merge(
	{
		entry: "./src/relay/relay_ChITTER.ts",
		output: {
			path: path.resolve(__dirname, "KoLmafia", "relay"),
			filename: "relay_ChITTER.js",
			libraryTarget: "commonjs",
		},
		module: {
			rules: [
				{
					loader: "babel-loader",
				},
			],
		},
	},
	sharedConfig
);

const relayConfig = merge(
	{
		entry: "./src/browser/index.tsx",
		output: {
			path: path.resolve(__dirname, "KoLmafia", "relay", "ChITTER"),
			filename: "ChITTER.js",
			libraryTarget: "commonjs",
		},
		module: {
			rules: [
				{
					loader: "babel-loader",
					options: { presets: ["@babel/env", "@babel/preset-react"] },
				},
			],
		},
	},
	sharedConfig
);

module.exports = [otherRelayConfig, relayConfig];
