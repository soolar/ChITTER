import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './css/App.scss'

const container = document.getElementById('root')
const root = createRoot(container as HTMLElement)
root.render(<App />)
