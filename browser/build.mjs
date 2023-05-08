import { build } from 'esbuild'
import babel from 'esbuild-plugin-babel'

build({
	bundle: true,
	minifySyntax: true,
	platform: 'node',
	target: 'rhino1.7.13',
	plugins: [babel()],
	define: {
		'process.env.NODE_ENV': '"development"',
	},
	alias: { kolmafia: 'tome-kolmafia-client' },
	outdir: '../KoLmafia/relay/ChITTER',
	entryPoints: { ChITTER: './src/index.tsx' },
	loader: { '.ts': 'tsx' },
})
