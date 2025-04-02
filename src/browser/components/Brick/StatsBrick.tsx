import { Divider, GridItem, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import ProgressBar from '../ProgressBar'
import Brick from './Brick'
import {
	canadiaAvailable,
	currentMcd,
	fullnessLimit,
	gnomadsAvailable,
	inBadMoon,
	inebrietyLimit,
	knollAvailable,
	monsterLevelAdjustment,
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
import PickerLauncher, { PickerParamsBase } from '../Picker/PickerLauncher'
import MCDPicker, { MCDOptionalType, MCDs } from '../Picker/MCDPicker'

interface CurrMax {
	curr: number
	max: number
}

interface ResourceRowArgs<PickerParams extends PickerParamsBase> {
	name: string
	valueStr: string
	value: CurrMax
	launches?: React.ComponentType<PickerParams>
	launchesArgs?: PickerParams
}

function ResourceRow<PickerParams extends PickerParamsBase>({
	name,
	valueStr,
	value,
	launches,
	launchesArgs,
}: ResourceRowArgs<PickerParams>) {
	const progBar = <ProgressBar value={value.curr} max={value.max} desc={name} />
	// TODO: Find a way to avoid using as here
	const finalProgBar = launches ? (
		<PickerLauncher
			WrappedPicker={launches}
			pickerProps={launchesArgs as PickerParams}
			fullButton
		>
			{progBar}
		</PickerLauncher>
	) : (
		progBar
	)
	return (
		<>
			<GridItem>
				<Heading>{name}</Heading>
			</GridItem>
			<GridItem textAlign="right">
				<Text>{valueStr}</Text>
			</GridItem>
			<GridItem>{finalProgBar}</GridItem>
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

function MCDRow() {
	const valueStr =
		monsterLevelAdjustment() === currentMcd()
			? `${currentMcd()}`
			: `${monsterLevelAdjustment()} (${currentMcd()})`
	const type: MCDOptionalType = knollAvailable()
		? 'knoll'
		: gnomadsAvailable()
			? 'gnomad'
			: canadiaAvailable()
				? 'canadia'
				: inBadMoon()
					? 'heartbreak'
					: undefined
	const info = type ? MCDs.get(type) : undefined
	if (!info) {
		return undefined
	}
	return (
		<ResourceRow
			name={info.label}
			valueStr={valueStr}
			value={{ curr: currentMcd(), max: info.maxOverride ?? 10 }}
			launches={MCDPicker}
			launchesArgs={{ type }}
		/>
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
				<GridItem colSpan={3}>
					<Divider />
				</GridItem>
				<MCDRow />
			</SimpleGrid>
		</Brick>
	)
}
