import { Divider, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Effect, haveEffect, haveSkill } from 'kolmafia'
import Brick from './Brick'
import { $effects, $skill, getActiveEffects } from 'libram'
import EffectIcon from '../Icons/EffectIcon'
import { getEffectInfo } from '../../../util/effectHelpers'
import PickerLauncher from '../Picker/PickerLauncher'
import ChitterIcon from '../Icons/ChitterIcon'
import FlavourPicker from '../Picker/FlavourPicker'

interface RawDisplayArgs {
	turnsLeft: number | React.ReactNode
	name: React.ReactNode
	desc?: string
	icon: React.ReactNode
	launches?: React.ComponentType<Record<string, never>>
}

function RawDisplay({ turnsLeft, name, desc, icon, launches }: RawDisplayArgs) {
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
				<Text className="chit-effect-turns">{turnsLeft}</Text>
				<Text className="chit-effect-extender">^</Text>
			</HStack>
		</Flex>
	)
}

interface EffectDisplayArgs {
	eff: Effect
}

function EffectDisplay({ eff }: EffectDisplayArgs) {
	const turnsLeft = haveEffect(eff)
	const extraInfo = getEffectInfo(eff)
	return (
		<RawDisplay
			turnsLeft={turnsLeft === 2147483647 ? <>&infin;</> : turnsLeft}
			name={<Text dangerouslySetInnerHTML={{ __html: eff.name }} />}
			desc={extraInfo.mods.length > 0 ? extraInfo.mods : undefined}
			icon={<EffectIcon effect={eff} />}
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
		haveSkill($skill`Flavour of Magic`) &&
		spirits.find((eff) => haveEffect(eff) > 0) === undefined
	return (
		<Brick name="effects" header="Effects">
			<VStack>
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
