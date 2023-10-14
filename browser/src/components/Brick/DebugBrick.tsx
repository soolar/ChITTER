import * as React from 'react'
import { Text, VStack } from '@chakra-ui/react'
import CallbackLink from '../Link/CallbackLink'
import Brick from './Brick'
import { set } from 'libram'

export default function DebugBrick() {
	const splitCallback = () => {
		set('chit.usechitter', false)
		/*
		let top: Window = window
		// infinite loop prevention measure if something weird happens
		let safety = 100
		while (top && top.parent !== top && safety > 0) {
			top = top.parent
			--safety
		}
		const rootset = top.frames['rootset'] as Window
		// TODO: Kill frame if it already exists
		const newFrame = top.document.createElement("frame")
		newFrame.name = "ChITTER"
		newFrame.id = "ChITTER"
		newFrame.src = "relay_ChITTER.js?relay=true"
		document.insertBefore(newFrame, rootset.children["charpane"])
		*/
	}

	return (
		<Brick name="debug" header="Debug">
			<VStack>
				<CallbackLink callback={() => set('chit.usechitter', false)}>
					<Text>Disable ChITTER</Text>
				</CallbackLink>
				<CallbackLink callback={splitCallback}>
					<Text>Split from charpane</Text>
				</CallbackLink>
			</VStack>
		</Brick>
	)
}
