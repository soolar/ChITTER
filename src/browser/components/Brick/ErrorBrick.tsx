import React from 'react'
import Brick from './Brick'
import { Text } from '@chakra-ui/react'

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
