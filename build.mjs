import { build } from 'esbuild'
import babel from 'esbuild-plugin-babel'

const config = {
	bundle: true,
	minifySyntax: true,
	platform: 'node',
	target: 'rhino1.7.13',
	external: ['kolmafia'],
	plugins: [babel()],
	define: {
		'process.env.NODE_ENV': '"production"',
	},
}

build({
	...config,
	outdir: 'KoLmafia/relay',
	entryPoints: {
		chitter_changeFav: './src/relay/chitter_changeFav.ts',
		relay_ChITTER: './src/relay/relay_ChITTER.ts',
	},
})

build({
	...config,
	outdir: 'KoLmafia/relay/ChITTER',
	entryPoints: { ChITTER: './src/browser/index.tsx' },
	loader: { '.ts': 'tsx' },
})
