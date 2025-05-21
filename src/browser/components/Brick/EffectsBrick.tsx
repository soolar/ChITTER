import {
	Divider,
	Flex,
	HStack,
	IconButton,
	Spacer,
	Text,
	Tooltip,
	VStack,
} from '@chakra-ui/react'
import { cliExecute, Effect, haveEffect } from 'kolmafia'
import Brick from './Brick'
import { get, getActiveEffects } from 'libram'
import EffectIcon from '../Icons/EffectIcon'
import {
	Counter,
	getCounterInfo,
	getEffectInfo,
	parseCounter,
} from '../../../util/helpers'
import PickerLauncher from '../Picker/PickerLauncher'
import ActionLink from '../Link/ActionLink'
import { ArrowUpIcon } from '@chakra-ui/icons'
import { needableEffects } from '../../../util/resources/effectList'
import MainLink from '../Link/MainLink'
import CounterIcon from '../Icons/CounterIcon'

interface RawEffectDisplayArgs {
	turnsLeft: number | React.ReactNode
	name: React.ReactNode
	desc?: string
	extendCommand?: string
	icon: React.ReactNode
	launches?: React.ComponentType<Record<string, never>>
	link?: string
}

export function RawEffectDisplay({
	turnsLeft,
	name,
	desc,
	extendCommand,
	icon,
	launches,
	link,
}: RawEffectDisplayArgs) {
	return (
		<Flex className="chit-effect">
			<HStack>
				{icon}
				<VStack spacing={0} className="chit-effect-description">
					{launches ? (
						<PickerLauncher WrappedPicker={launches} pickerProps={{}}>
							{name}
						</PickerLauncher>
					) : link ? (
						<MainLink href={link}>name</MainLink>
					) : (
						name
					)}
					{desc && (
						<Text
							className="desc-line"
							dangerouslySetInnerHTML={{ __html: desc }}
						/>
					)}
				</VStack>
			</HStack>
			<Spacer />
			<HStack>
				{extendCommand && (
					<ActionLink callback={() => cliExecute(extendCommand)}>
						<Tooltip label={<Text>{extendCommand}</Text>}>
							<IconButton
								icon={<ArrowUpIcon />}
								size="xs"
								aria-label="extend effect"
							/>
						</Tooltip>
					</ActionLink>
				)}
				<Text className="chit-effect-turns">{turnsLeft}</Text>
			</HStack>
		</Flex>
	)
}

interface EffectDisplayArgs {
	eff: Effect
}

function EffectDisplay({ eff }: EffectDisplayArgs) {
	const extraInfo = getEffectInfo(eff)
	return (
		<RawEffectDisplay
			turnsLeft={extraInfo.displayTurns}
			name={
				typeof extraInfo.displayName === 'string' ? (
					<Text dangerouslySetInnerHTML={{ __html: extraInfo.displayName }} />
				) : (
					extraInfo.displayName
				)
			}
			desc={extraInfo.mods.length > 0 ? extraInfo.mods : undefined}
			extendCommand={eff.default !== '' ? eff.default : undefined}
			icon={<EffectIcon effect={eff} medium />}
			launches={extraInfo.launches}
		/>
	)
}

interface CounterDisplayArgs {
	counter: Counter
}

function CounterDisplay({ counter }: CounterDisplayArgs) {
	const info = getCounterInfo(counter)
	if (info.desc.length > 0 && typeof info.desc[0] !== 'string') {
		console.error(`Faulty desc for counter ${info.displayName}`)
		return
	}
	return (
		<RawEffectDisplay
			turnsLeft={counter.turnsLeft}
			name={<Text>{info.displayName}</Text>}
			icon={<CounterIcon counter={counter} medium />}
			link={counter.url}
			desc={info.desc.length > 0 ? (info.desc[0] as string) : undefined}
		/>
	)
}

type EffectOrCounter = Effect | Counter

function effOrCounterTurnsLeft(effOrCounter: EffectOrCounter) {
	return effOrCounter instanceof Effect
		? haveEffect(effOrCounter)
		: effOrCounter.turnsLeft
}

export default function EffectsBrick() {
	// 907:Vote Monster:absballot.gif:905:Wormwood loc=151 loc=152 loc=153 place.php?whichplace=wormwood:tinybottle.gif:909:Wormwood loc=151 loc=152 loc=153 place.php?whichplace=wormwood:tinybottle.gif:913:Wormwood loc=151 loc=152 loc=153 place.php?whichplace=wormwood:tinybottle.gif
	const countersSplit = get('relayCounters').split(':')
	const counters: Counter[] = []
	if (countersSplit.length % 3 === 0) {
		for (let i = 0; i < countersSplit.length; i += 3) {
			counters.push(
				parseCounter(
					Number(countersSplit[i]),
					countersSplit[i + 1],
					countersSplit[i + 2],
				),
			)
		}
	}
	const myEffsAndCounters: EffectOrCounter[] = getActiveEffects()
	myEffsAndCounters.push(...counters)
	const myEffsAndCountersSorted = myEffsAndCounters.sort(
		(effOrCounter1, effOrCounter2) => {
			const turnsDiff =
				effOrCounterTurnsLeft(effOrCounter1) -
				effOrCounterTurnsLeft(effOrCounter2)
			return turnsDiff === 0
				? effOrCounter1.name > effOrCounter2.name
					? 1
					: -1
				: turnsDiff
		},
	)
	return (
		<Brick name="effects" header="Effects">
			<VStack spacing={0}>
				<Divider />
				{myEffsAndCountersSorted.map((effOrCounter) => {
					return (
						<>
							{effOrCounter instanceof Effect ? (
								<EffectDisplay
									eff={effOrCounter}
									key={`effdisp${effOrCounter.name}`}
								/>
							) : (
								<CounterDisplay counter={effOrCounter} />
							)}
							<Divider key={`div${effOrCounter.name}`} />
						</>
					)
				})}
				{needableEffects.map((needableInfo) => {
					if (needableInfo.condition()) {
						return (
							<>
								{needableInfo.neededDisplay}
								<Divider />
							</>
						)
					}
				})}
			</VStack>
		</Brick>
	)
}
