import * as React from 'react'
import { Text } from '@chakra-ui/react'
import Brick from './Brick'

interface ErrorBrickArgs {
	name: string
}

export default function ErrorBrick({ name }: ErrorBrickArgs) {
	return (
		<Brick name={`error${name}`} header="Error">
			<Text>Unrecognized brick name: {name}</Text>
		</Brick>
	)
}
