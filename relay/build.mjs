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
	external: ['kolmafia'],
	outdir: '../KoLmafia/relay',
	entryPoints: {
		chitter_changeFav: './src/chitter_changeFav.ts',
		relay_ChITTER: './src/relay_ChITTER.ts',
	},
})
