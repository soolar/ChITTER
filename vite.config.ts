import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	base: '/chitter/',
	plugins: [react()],
	build: {
		outDir: 'build/relay/chitter',
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, './index.html'),
				load: path.resolve(__dirname, './load.html'),
			},
		},
	},
	server: {
		// this ensures that the browser opens upon server start
		open: true,
		port: 3000,
		proxy: {
			['^/(?!chitter/|src/|node_modules/|@react-refresh|@vite).*(?<!.js.map)$']:
				{
					target: 'http://127.0.0.1:60080',
					changeOrigin: true,
					secure: false,
				},
		},
	},
})
