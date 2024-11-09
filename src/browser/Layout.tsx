import { useContext } from 'react'
import {
	Container,
	Flex,
	IconButton,
	Link,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
	Spacer,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import { RefreshContext } from 'tome-kolmafia-react'
import brickRegistry, { BrickName } from './components/Brick/BrickRegistry'
import ErrorBrick from './components/Brick/ErrorBrick'
import { CloseIcon, RepeatIcon, WarningIcon } from '@chakra-ui/icons'

interface BrickOrder {
	roof: BrickName[]
	walls: BrickName[]
	floor: BrickName[]
	toolbar: BrickName[]
}

type SectionName = keyof BrickOrder

interface ChitterBrickArgs {
	brickName: BrickName
}

function ChitterBrick({ brickName }: ChitterBrickArgs) {
	const CurrBrick = brickRegistry[brickName].brick
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
		roof: ['character', 'stats', 'gear', 'trail'],
		walls: ['thrall', 'effects'],
		floor: ['familiar'],
		toolbar: ['modifiers'],
	}

	return (
		<Flex height="full" flexDirection="column" flexWrap="nowrap" id="chit_home">
			{(['roof', 'walls', 'floor'] as const).map((sectionName) => (
				<ChitterSection
					sectionName={sectionName}
					bricks={brickOrder[sectionName]}
				/>
			))}
			<Container maxW="full" id="chit_toolbar" p="2px" className="chit-footer">
				<Flex>
					<Link href="/chitter/index.html">
						<Tooltip label={<Text>Reload ChITTER</Text>}>
							<IconButton aria-label="Reload" size="xs" icon={<RepeatIcon />} />
						</Tooltip>
					</Link>
					<Spacer />
					{brickOrder.toolbar.map((brickName) => {
						const brickInfo = brickRegistry[brickName]
						const icon = brickInfo.icon ?? <WarningIcon />
						const ThisBrick = brickInfo.brick
						return (
							<Popover>
								<PopoverTrigger>
									<IconButton
										aria-label={`Open ${brickName} brick`}
										size="xs"
										icon={icon}
									/>
								</PopoverTrigger>
								<PopoverContent>
									<PopoverArrow />
									<PopoverCloseButton />
									<PopoverBody>
										<ThisBrick />
									</PopoverBody>
								</PopoverContent>
							</Popover>
						)
					})}
					<Spacer />
					<Tooltip
						label={<Text>TODO: Close ChITTER with this button lol</Text>}
					>
						<IconButton
							aria-label="Close (TODO)"
							size="xs"
							icon={<CloseIcon />}
						/>
					</Tooltip>
				</Flex>
			</Container>
		</Flex>
	)
}
