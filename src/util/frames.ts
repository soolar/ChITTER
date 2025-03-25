const CHARPANE_URL = 'charpane.php' as const

export function getParent(): Window {
	return window.parent.parent.parent
}

export function getFrames(): Window {
	return getParent().frames
}

export function findCharPane(): {
	pane: Window | undefined
	parent: HTMLFrameSetElement | undefined
} {
	const allFrames = getFrames()
	if (!allFrames) return { pane: undefined, parent: undefined }

	for (let i = 0; i < allFrames.length; ++i) {
		const frame = allFrames[i]
		if (!frame || !frame.location) continue

		if (frame.location.href.endsWith(CHARPANE_URL)) {
			const frameElement = frame.frameElement
			if (!frameElement?.parentElement) continue

			return {
				pane: frame,
				parent: frameElement.parentElement as HTMLFrameSetElement,
			}
		}
	}

	return { pane: undefined, parent: undefined }
}
