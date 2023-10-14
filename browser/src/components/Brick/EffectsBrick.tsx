import { Divider, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import { Effect, myEffects, toEffect } from 'kolmafia'
import * as React from 'react'
import { useExtraEffectInfo } from '../../effectHelpers'
import EffectIcon from '../Icons/EffectIcon'
import PickerLauncher from '../Picker/PickerLauncher'
import Brick from './Brick'

interface EffectLineTextArgs {
	eff: Effect
}

function EffectLineText({ eff }: EffectLineTextArgs) {
	const extraInfo = useExtraEffectInfo(eff)
	const nameBlock = <Text dangerouslySetInnerHTML={{ __html: eff.name }} />
	return (
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
	)
}

interface EffectLineArgs {
	effName: string
	turns: number
}

function EffectLine({ effName, turns }: EffectLineArgs) {
	const eff = toEffect(effName)

	return (
		<>
			<Flex key={effName} className="chit-effect">
				<HStack>
					<EffectIcon effect={eff} size="medium" />
					{eff ? <EffectLineText eff={eff} /> : <Text>Loading...</Text>}
				</HStack>
				<Spacer />
				<HStack>
					<Text className="chit-effect-turns">
						{turns === -1 ? <>&infin;</> : turns}
					</Text>
					<Text className="chit-effect-extender">^</Text>
				</HStack>
			</Flex>
			<Divider />
		</>
	)
}

interface EffectListArgs {
	effMap: { [effName: string]: number }
}

function EffectList({ effMap }: EffectListArgs) {
	const activeEffectNames: string[] = []
	Object.keys(effMap).forEach((effName) => {
		if (effName) {
			activeEffectNames.push(effName)
		}
	})
	const sortedEffects = activeEffectNames.sort((eff1, eff2) => {
		const turns1 = effMap[eff1] === -1 ? 2147483647 : effMap[eff1]
		const turns2 = effMap[eff2] === -1 ? 2147483647 : effMap[eff2]
		const turnsDiff = turns1 - turns2
		return turnsDiff === 0 ? (eff1 > eff2 ? 1 : -1) : turnsDiff
	})

	return (
		<VStack>
			<Divider />
			{sortedEffects.map((eff) => (
				<EffectLine key={`efflist${eff}`} effName={eff} turns={effMap[eff]} />
			))}
		</VStack>
	)
}

export default function EffectsBrick() {
	const effectsMap = myEffects()
	return (
		<Brick name="Effects" header="Effects">
			{effectsMap ? (
				<EffectList effMap={effectsMap} />
			) : (
				<Text>Loading...</Text>
			)}
		</Brick>
	)
}
