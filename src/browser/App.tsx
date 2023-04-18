import * as React from 'react'
import { ChakraProvider, Container, Flex, Spacer } from '@chakra-ui/react'
import brickRegistry, { BrickName } from './components/Brick/BrickRegistry'
import ErrorBrick from './components/Brick/ErrorBrick'
import theme from './theme'

interface BrickOrder {
	roof: BrickName[]
	walls: BrickName[]
	floor: BrickName[]
}

type SectionName = keyof BrickOrder

interface ChitterBrickArgs {
	brickName: BrickName
}

function ChitterBrick({ brickName }: ChitterBrickArgs) {
	const CurrBrick = brickRegistry[brickName]
	if (CurrBrick === undefined) {
		return <ErrorBrick name={brickName.toString()} />
	}
	return <CurrBrick />
}

interface ChitterSectionArgs {
	sectionName: SectionName
	bricks: BrickName[]
}

function ChitterSection({ sectionName, bricks }: ChitterSectionArgs) {
	return (
		<Container
			maxW="full"
			id={`chit_${sectionName}`}
			p="2px"
			className="chit_chamber"
		>
			{bricks.map((brickName) => (
				<ChitterBrick brickName={brickName} />
			))}
		</Container>
	)
}

export default function App() {
	const brickOrder = {
		roof: ['character', 'stats', 'gear', 'trail'],
		walls: ['effects', 'debug'],
		floor: ['familiar'],
	}
	return (
		<ChakraProvider theme={theme}>
			<Flex height="full" flexDirection="column">
				{(['roof', 'walls', 'floor'] as const).map((sectionName) => (
					<ChitterSection
						sectionName={sectionName}
						bricks={brickOrder[sectionName]}
					/>
				))}
			</Flex>
		</ChakraProvider>
	)
}
