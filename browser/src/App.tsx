import * as React from 'react'
import { ChakraProvider, Container, Flex } from '@chakra-ui/react'
import brickRegistry, { BrickName } from './components/Brick/BrickRegistry'
import ErrorBrick from './components/Brick/ErrorBrick'
import theme from './theme'
import { call, RefreshContextProvider } from 'tome-kolmafia-client'
import RefreshContext from 'tome-kolmafia-client/src/contexts/RefreshContext'

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
				<ChitterBrick key={brickName} brickName={brickName} />
			))}
		</Container>
	)
}

function Layout() {
	React.useContext(RefreshContext)
	const brickOrder = {
		roof: ['character', 'stats', 'gear'],
		walls: ['effects', 'debug'],
		floor: ['familiar'],
	}
	return (
		<Flex height="full" flexDirection="column" flexWrap="nowrap" id="chit_home">
			{(['roof', 'walls', 'floor'] as const).map((sectionName) => (
				<ChitterSection
					key={sectionName}
					sectionName={sectionName}
					bricks={brickOrder[sectionName]}
				/>
			))}
		</Flex>
	)
}

async function getChitterCharacterState() {
	const [
		myTurncount,
		myMeat,
		myHp,
		myMp,
		myFamiliar,
		myAdventures,
		myEffectCount,
	] = await Promise.all([
		call.myTurncount(),
		call.myMeat(),
		call.myHp(),
		call.myMp(),
		call.myFamiliar().name,
		call.myAdventures(),
		Object.keys(call.myEffects()).length,
	])
	const slotNames = [
		'hat',
		'back',
		'shirt',
		'weapon',
		'off-hand',
		'pants',
		'acc1',
		'acc2',
		'acc3',
		'familiar',
	]
	const slots = await Promise.all(
		slotNames.map((slotName) => call.toSlot(slotName)),
	)
	const equipment = await Promise.all(
		slots.map((slot) => call.equippedItem(slot)),
	)
	const equipmentIds = await Promise.all(
		equipment.map((equipped) => call.toInt(equipped)),
	)
	return {
		myTurncount,
		myMeat,
		myHp,
		myMp,
		myFamiliar,
		myAdventures,
		myEffectCount,
		myHat: equipmentIds[0],
		myBack: equipmentIds[1],
		myShirt: equipmentIds[2],
		myWeapon: equipmentIds[3],
		myOffHand: equipmentIds[4],
		myPants: equipmentIds[5],
		myAcc1: equipmentIds[6],
		myAcc2: equipmentIds[7],
		myAcc3: equipmentIds[8],
		myFamEquip: equipmentIds[9],
	}
}

export default function App() {
	return (
		<ChakraProvider theme={theme}>
			<RefreshContextProvider
				charStateOverride={getChitterCharacterState}
				interval={4000}
			>
				<Layout />
			</RefreshContextProvider>
		</ChakraProvider>
	)
}
