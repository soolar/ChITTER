import { Divider, GridItem, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import ProgressBar from '../ProgressBar'
import Brick from './Brick'
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
	Stat,
} from 'kolmafia'
import { $stat } from 'libram'

interface CurrMax {
	curr: number
	max: number
}

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
	stat: Stat
}

function StatRow({ name, stat }: StatRowArgs) {
	const base = myBasestat(stat)
	const buffed = myBuffedstat(stat)
	const substats = myBasestat(
		stat === $stat`Muscle`
			? $stat`submuscle`
			: stat === $stat`Mysticality`
				? $stat`submysticality`
				: $stat`submoxie`,
	)
	const valueBit =
		base === buffed ? (
			<Text>{base.toLocaleString()}</Text>
		) : (
			<Text>
				<Text as="span">{buffed.toLocaleString()}</Text> (
				{base.toLocaleString()})
			</Text>
		)
	const lower = base ** 2
	const upper = (base + 1) ** 2
	const forLevel = upper - lower
	const soFarLevel = substats - lower

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
		<Brick name="stats" header="My Stats">
			<SimpleGrid columns={3}>
				<SimpleResourceRow name="HP" value={{ curr: myHp(), max: myMaxhp() }} />
				<SimpleResourceRow name="MP" value={{ curr: myMp(), max: myMaxmp() }} />
				<GridItem colSpan={3}>
					<Divider />
				</GridItem>
				<StatRow name="Mus" stat={$stat`Muscle`} />
				<StatRow name="Mys" stat={$stat`Mysticality`} />
				<StatRow name="Mox" stat={$stat`Moxie`} />
				<GridItem colSpan={3}>
					<Divider />
				</GridItem>
				<SimpleResourceRow
					name="Stomach"
					value={{ curr: myFullness(), max: fullnessLimit() }}
				/>
				<SimpleResourceRow
					name="Liver"
					value={{ curr: myInebriety(), max: inebrietyLimit() }}
				/>
				<SimpleResourceRow
					name="Spleen"
					value={{ curr: mySpleenUse(), max: spleenLimit() }}
				/>
			</SimpleGrid>
		</Brick>
	)
}
