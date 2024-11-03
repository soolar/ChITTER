import { Effect, haveEffect, stringModifier } from 'kolmafia'
import { $effect, get } from 'libram'
import React from 'react'
import FlavourPicker from '../browser/components/Picker/FlavourPicker'
import { parseMods } from '.'
import { Text } from '@chakra-ui/react'

interface EffectInfo {
	mods: string
	launches?: React.ComponentType<Record<string, never>>
	displayName: string | React.ReactNode
	displayTurns: number | string | React.ReactNode
}

export function getEffectInfo(eff: Effect): EffectInfo {
	const turnsLeft = haveEffect(eff)
	const res: EffectInfo = {
		mods: stringModifier(eff, 'Evaluated Modifiers'),
		displayName: eff.name,
		displayTurns: turnsLeft === 2147483647 ? <>&infin;</> : turnsLeft,
	}
	let doParse = true

	switch (eff.identifierString) {
		case $effect`Video... Games?`.identifierString: {
			res.mods = 'Basically Everything +5'
			break
		}
		case $effect`Spirit of Bacon Grease`.identifierString: {
			res.displayName = <Text color="blueviolet">{eff.name}</Text>
			res.launches = FlavourPicker
			break
		}
		case $effect`Spirit of Peppermint`.identifierString: {
			res.displayName = <Text color="blue">{eff.name}</Text>
			res.launches = FlavourPicker
			break
		}
		case $effect`Spirit of Wormwood`.identifierString: {
			res.displayName = <Text color="grey">{eff.name}</Text>
			res.launches = FlavourPicker
			break
		}
		case $effect`Spirit of Cayenne`.identifierString: {
			res.displayName = <Text color="red">{eff.name}</Text>
			res.launches = FlavourPicker
			break
		}
		case $effect`Spirit of Garlic`.identifierString: {
			res.displayName = <Text color="green">{eff.name}</Text>
			res.launches = FlavourPicker
			break
		}
		case $effect`Citizen of a Zone`.identifierString: {
			res.displayName = `Citizen of ${get('_citizenZone')}`
			res.displayTurns = 'Today'
			break
		}
		case $effect`Everything Looks Blue`.identifierString: {
			res.displayName = <Text color="blue">{eff.name}</Text>
			break
		}
		case $effect`Everything Looks Red`.identifierString: {
			res.displayName = <Text color="red">{eff.name}</Text>
			break
		}
		case $effect`Everything Looks Yellow`.identifierString: {
			res.displayName = <Text color="olive">{eff.name}</Text>
			break
		}
		case $effect`Everything Looks Green`.identifierString: {
			res.displayName = <Text color="green">{eff.name}</Text>
			break
		}
		case $effect`Everything Looks Purple`.identifierString: {
			res.displayName = <Text color="purple">{eff.name}</Text>
			break
		}
		case $effect`On the Trail`.identifierString: {
			res.mods = get('olfactedMonster')?.identifierString ?? ''
			doParse = false
			break
		}
		case $effect`Super Skill`.identifierString: {
			res.mods = 'Combat skills/spells cost 0 MP'
			doParse = false
			break
		}
	}

	if (doParse) {
		res.mods = parseMods(res.mods)
	}

	return res
}
