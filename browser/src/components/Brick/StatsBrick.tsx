import { Divider, GridItem, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import {
	fullnessLimit,
	inebrietyLimit,
	myBasestat,
	myBuffedstat,
	myFullness,
	myHp,
	myInebriety,
	myMaxhp,
	myMaxmp,
	myMp,
	mySpleenUse,
	spleenLimit,
} from 'kolmafia'
import { $stat } from 'libram'
import * as React from 'react'
import { CurrMax, StatValues } from '../../utils'
import ProgressBar from '../ProgressBar'
import Brick from './Brick'

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
			valueStr={`${value.curr.toLocaleString()} / ${value.max.toLocaleString()}`}
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
			<Text>{statValues.base.toLocaleString()}</Text>
		) : (
			<Text>
				<Text as="span">{statValues.buffed.toLocaleString()}</Text> (
				{statValues.base.toLocaleString()})
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
	const my = {
		hp: { curr: myHp(), max: myMaxhp() },
		mp: { curr: myMp(), max: myMaxmp() },
		fullness: { curr: myFullness(), max: fullnessLimit() },
		inebriety: { curr: myInebriety(), max: inebrietyLimit() },
		spleenUse: { curr: mySpleenUse(), max: spleenLimit() },

		muscle: {
			base: myBasestat($stat`Muscle`),
			buffed: myBuffedstat($stat`Muscle`),
			substats: myBasestat($stat`Submuscle`),
		},
		mysticality: {
			base: myBasestat($stat`Mysticality`),
			buffed: myBuffedstat($stat`Mysticality`),
			substats: myBasestat($stat`Submysticality`),
		},
		moxie: {
			base: myBasestat($stat`Moxie`),
			buffed: myBuffedstat($stat`Moxie`),
			substats: myBasestat($stat`Submoxie`),
		},
	}
	return (
		<Brick name="stats" header="My Stats">
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
