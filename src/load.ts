import { getFrames } from './util/frames'

declare global {
	interface Window {
		rootset?: HTMLFrameSetElement
		charpane?: Window
		chatpane?: Window
		mainpane?: Window
		XMLHttpRequest: typeof XMLHttpRequest
	}
}

function load() {
	const allFrames = getFrames()
	if (!allFrames) {
		console.error("ChITTER: Failed to load. Can't find frames.")
		return
	}

	const rootset = allFrames.rootset
	if (!rootset) {
		console.error("ChITTER: Failed to load. Can't find rootset.")
		return
	}

	const charpane = allFrames.charpane
	if (!charpane) {
		console.error("ChITTER: Failed to load. Can't find charpane.")
		return
	}

	charpane.location.href = '/chitter/index.html'

	const mainpane = allFrames.mainpane
	if (mainpane) {
		mainpane.location.href = '/main.php'
	}
}

load()
