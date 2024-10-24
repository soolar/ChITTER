import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './css/App.scss'

import App from './App'

const content = <App />

const app = (
	<React.StrictMode>
		<BrowserRouter basename="/chitter">
			<Routes>
				<Route path="/" element={content} />
				<Route path="index.html" element={content} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
)

const root = document.getElementById('root')
if (root) {
	createRoot(root).render(app)
}
