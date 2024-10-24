export function getParent(): Window {
	return window.parent.parent.parent
}

export function getFrames(): Window {
	return getParent().frames
}
