import * as React from 'react'
import { ChakraProvider, Container } from '@chakra-ui/react'
import brickRegistry from './components/Brick/BrickRegistry'
import ErrorBrick from './components/Brick/ErrorBrick'
import theme from './theme'

export default function App() {
	const brickOrder = {
		roof: ['character', 'stats', 'gear'],
		walls: ['effects', 'debug'],
		floor: ['familiar'],
	}
	const handleBrick = (brickName: string) => {
		const CurrBrick = brickRegistry[brickName]
		if (CurrBrick === undefined) {
			return <ErrorBrick name={brickName} />
		}
		return <CurrBrick />
	}
	return (
		<ChakraProvider theme={theme}>
			{(['roof', 'walls', 'floor'] as const).map((sectionName) => (
				<Container
					maxW="full"
					id={`chit_${sectionName}`}
					p="2px"
					className="chit_chamber"
				>
					{brickOrder[sectionName].map(handleBrick)}
				</Container>
			))}
		</ChakraProvider>
	)
}
