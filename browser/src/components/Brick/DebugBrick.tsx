import * as React from 'react'
import { Text } from '@chakra-ui/react'
import CommandLink from '../Link/CommandLink'
import Brick from './Brick'

export default function DebugBrick() {
	return (
		<Brick name="debug" header="Debug">
			<CommandLink cmd="set chit.usechitter = false">
				<Text>Disable ChITTER</Text>
			</CommandLink>
		</Brick>
	)
}
