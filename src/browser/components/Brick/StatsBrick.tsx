import { Divider, GridItem, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import * as React from 'react'
import { BrowserCharacter } from '../../../character'
import { CurrMax, StatValues } from '../../../utils'
import ProgressBar from '../ProgressBar'
import Brick from './Brick'

declare const my: BrowserCharacter

interface ResourceRowArgs {
	name: string
	valueStr: string
	value: CurrMax
}

function ResourceRow({ name, valueStr, value }: ResourceRowArgs) {
	return (
		<>
			<GridItem>
				<Heading>{name}</Heading>
			</GridItem>
			<GridItem textAlign="right">
				<Text>{valueStr}</Text>
			</GridItem>
			<GridItem>
				<ProgressBar value={value.curr} max={value.max} desc={name} />
			</GridItem>
		</>
	)
}

interface SimpleResourceRowArgs {
	name: string
	value: CurrMax
}

function SimpleResourceRow({ name, value }: SimpleResourceRowArgs) {
	return (
		<ResourceRow
			name={name}
			valueStr={`${value.curr} / ${value.max}`}
			value={value}
		/>
	)
}

interface StatRowArgs {
	name: string
	statValues: StatValues
}

function StatRow({ name, statValues }: StatRowArgs) {
	const valueBit =
		statValues.base === statValues.buffed ? (
			<Text>{statValues.base}</Text>
		) : (
			<Text>
				<Text as="span">{statValues.buffed}</Text> ({statValues.base})
			</Text>
		)
	const lower = statValues.base ** 2
	const upper = (statValues.base + 1) ** 2
	const forLevel = upper - lower
	const soFarLevel = statValues.substats - lower

	return (
		<>
			<GridItem>
				<Heading>{name}</Heading>
			</GridItem>
			<GridItem textAlign="right">{valueBit}</GridItem>
			<GridItem>
				<ProgressBar
					value={soFarLevel}
					max={forLevel}
					desc={`${name} substats`}
				/>
			</GridItem>
		</>
	)
}

export default function StatsBrick() {
	return (
		<Brick name="stats" header={<Heading>My Stats</Heading>}>
			<SimpleGrid columns={3}>
				<SimpleResourceRow name="HP" value={my.hp} />
				<SimpleResourceRow name="MP" value={my.mp} />
				<GridItem colSpan={3}>
					<Divider />
				</GridItem>
				<StatRow name="Mus" statValues={my.muscle} />
				<StatRow name="Mys" statValues={my.mysticality} />
				<StatRow name="Mox" statValues={my.moxie} />
				<GridItem colSpan={3}>
					<Divider />
				</GridItem>
				<SimpleResourceRow name="Stomach" value={my.fullness} />
				<SimpleResourceRow name="Liver" value={my.inebriety} />
				<SimpleResourceRow name="Spleen" value={my.spleenUse} />
			</SimpleGrid>
		</Brick>
	)
}
