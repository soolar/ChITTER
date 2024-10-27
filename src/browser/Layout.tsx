import { useContext } from 'react'
import { Container, Flex } from '@chakra-ui/react'
import { RefreshContext } from 'tome-kolmafia'
import brickRegistry, { BrickName } from './components/Brick/BrickRegistry'
import ErrorBrick from './components/Brick/ErrorBrick'

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

export default function Layout() {
	useContext(RefreshContext)

	const brickOrder: BrickOrder = {
		roof: ['gear'],
		walls: ['effects'],
		floor: ['familiar'],
	}

	return (
		<Flex height="full" flexDirection="column" flexWrap="nowrap" id="chit_home">
			{(['roof', 'walls', 'floor'] as const).map((sectionName) => (
				<ChitterSection
					sectionName={sectionName}
					bricks={brickOrder[sectionName]}
				/>
			))}
		</Flex>
	)
}
