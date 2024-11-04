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
import React from 'react'
import { cliExecute, Effect, haveEffect } from 'kolmafia'
import Brick from './Brick'
import { $effects, $skill, getActiveEffects, have } from 'libram'
import EffectIcon from '../Icons/EffectIcon'
import { getEffectInfo } from '../../../util/effectHelpers'
import PickerLauncher from '../Picker/PickerLauncher'
import ChitterIcon from '../Icons/ChitterIcon'
import FlavourPicker from '../Picker/FlavourPicker'
import ActionLink from '../Link/ActionLink'
import { ArrowUpIcon } from '@chakra-ui/icons'

interface RawDisplayArgs {
	turnsLeft: number | React.ReactNode
	name: React.ReactNode
	desc?: string
	extendCommand?: string
	icon: React.ReactNode
	launches?: React.ComponentType<Record<string, never>>
}

function RawDisplay({
	turnsLeft,
	name,
	desc,
	extendCommand,
	icon,
	launches,
}: RawDisplayArgs) {
	return (
		<Flex className="chit-effect">
			<HStack>
				{icon}
				<VStack spacing={0} className="chit-effect-description">
					{launches ? (
						<PickerLauncher WrappedPicker={launches} pickerProps={{}}>
							{name}
						</PickerLauncher>
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
		<RawDisplay
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

export default function EffectsBrick() {
	const myEffs = getActiveEffects().sort((eff1, eff2) => {
		const turnsDiff = haveEffect(eff1) - haveEffect(eff2)
		return turnsDiff === 0
			? eff1.identifierNumber - eff2.identifierNumber
			: turnsDiff
	})
	const spirits = $effects`Spirit of Bacon Grease, Spirit of Peppermint, Spirit of Wormwood, Spirit of Cayenne, Spirit of Garlic`
	const needSpirit =
		have($skill`Flavour of Magic`) &&
		spirits.find((eff) => haveEffect(eff) > 0) === undefined
	return (
		<Brick name="effects" header="Effects">
			<VStack spacing={0}>
				<Divider />
				{myEffs.map((eff) => {
					return (
						<>
							<EffectDisplay eff={eff} key={`effdisp${eff.name}`} />
							<Divider key={`div${eff.name}`} />
						</>
					)
				})}
				{needSpirit && (
					<>
						<RawDisplay
							turnsLeft={0}
							name={<Text>Choose a Flavour</Text>}
							icon={
								<ChitterIcon
									medium
									image={'flavorofmagic.gif'}
									tooltip={<Text>Choose a Flavour</Text>}
								/>
							}
							launches={FlavourPicker}
						/>
						<Divider />
					</>
				)}
			</VStack>
		</Brick>
	)
}
