import { ChakraProvider, Container } from '@chakra-ui/react'
import * as React from 'react'
import brickRegistry from './components/Brick/BrickRegistry'
import ErrorBrick from './components/Brick/ErrorBrick'
import theme from './theme'

export default function App() {
	const brickOrder = [
		'char',
		'stats',
		'gear',
		'eff',
		'fam',
		'debug',
	]

	return (
		<ChakraProvider theme={theme}>
			<Container maxW="full" p="2px">
				{brickOrder.map((brickName) => {
					const CurrBrick = brickRegistry[brickName]
					if (CurrBrick === undefined) {
						return <ErrorBrick name={brickName} />
					}
					return <CurrBrick />
				})}
			</Container>
		</ChakraProvider>
	)
}
