import { findCharPane, getFrames, getParent } from './util/frames'

declare global {
	interface Window {
		revision?: number
		rootset?: HTMLFrameSetElement
		charpane?: Window
		chitterpane?: Window
		chatpane?: Window
		mainpane?: Window
		XMLHttpRequest: typeof XMLHttpRequest
	}
}

const MINIMUM_REVISION = 28088

function load() {
	const currentRevision = window.parent.parent.revision
	if (
		currentRevision !== undefined &&
		0 < currentRevision &&
		currentRevision < MINIMUM_REVISION
	) {
		document.body.innerHTML = `<h1>Need KoLmafia at least version ${MINIMUM_REVISION} for ChITTER (you have ${currentRevision}).</h1>`
		return
	}

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

	const existingChitterPane = allFrames.chitterpane
	if (existingChitterPane) {
		existingChitterPane.location.reload()
		return
	}

	const { pane: charPane, parent: framesetParent } = findCharPane()
	if (!charPane?.frameElement || !framesetParent) {
		console.error("ChITTER: Failed to load. Can't find char pane.")
		return
	}

	const chitterFrame = getParent().document.createElement('frame')
	chitterFrame.id = 'chitterpane'
	chitterFrame.src = '/chitter/index.html'

	rootset.insertBefore(chitterFrame, charPane.frameElement)
	// TODO: Play nice with Yorick/tourguide when they exist alongside chat
	const currentCols = rootset.cols.split(',')
	currentCols.splice(1, 0, '0%')
	rootset.cols = currentCols.join(',')

	const mainpane = allFrames.mainpane
	if (mainpane) {
		mainpane.location.href = '/main.php'
	}
}

load()
