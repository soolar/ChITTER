import { Divider, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Effect, haveEffect } from 'kolmafia'
import Brick from './Brick'
import { getActiveEffects } from 'libram'
import EffectIcon from '../Icons/EffectIcon'
import { getEffectInfo } from '../../../util/effectHelpers'
import PickerLauncher from '../Picker/PickerLauncher'

interface EffectDisplayArgs {
	eff: Effect
}

function EffectDisplay({ eff }: EffectDisplayArgs) {
	const turnsLeft = haveEffect(eff)
	const nameBlock = <Text dangerouslySetInnerHTML={{ __html: eff.name }} />
	const extraInfo = getEffectInfo(eff)
	return (
		<Flex className="chit-effect">
			<HStack>
				<EffectIcon effect={eff} />
				<VStack spacing={0} className="chit-effect-description">
					{extraInfo.launches ? (
						<PickerLauncher WrappedPicker={extraInfo.launches} pickerProps={{}}>
							{nameBlock}
						</PickerLauncher>
					) : (
						nameBlock
					)}
					{extraInfo.mods.length > 0 && (
						<Text
							className="desc-line"
							dangerouslySetInnerHTML={{ __html: extraInfo.mods }}
						/>
					)}
				</VStack>
			</HStack>
			<Spacer />
			<HStack>
				<Text className="chit-effect-turns">
					{turnsLeft === 2147483647 ? <>&infin;</> : turnsLeft}
				</Text>
				<Text className="chit-effect-extender">^</Text>
			</HStack>
		</Flex>
	)
}

export default function EffectsBrick() {
	const myEffs = getActiveEffects().sort((eff1, eff2) => {
		const turnsDiff = haveEffect(eff1) - haveEffect(eff2)
		return turnsDiff === 0
			? eff1.identifierNumber - eff2.identifierNumber
			: turnsDiff
	})
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
			</VStack>
		</Brick>
	)
}
