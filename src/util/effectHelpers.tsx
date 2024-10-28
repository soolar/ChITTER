import { Effect, stringModifier } from 'kolmafia'
import { $effect } from 'libram'
import React from 'react'
import FlavourPicker from '../browser/components/Picker/FlavourPicker'
import { parseMods } from '.'

interface EffectInfo {
	mods: string
	desc?: React.ReactNode
	launches?: React.ComponentType<Record<string, never>>
}

export function getEffectInfo(eff: Effect): EffectInfo {
	const res: EffectInfo = { mods: stringModifier(eff, 'Evaluated Modifiers') }

	switch (eff.identifierString) {
		case $effect`Video... Games?`.identifierString: {
			res.mods = 'Basically Everything +5'
			break
		}
		case $effect`Spirit of Bacon Grease`.identifierString:
		case $effect`Spirit of Peppermint`.identifierString:
		case $effect`Spirit of Wormwood`.identifierString:
		case $effect`Spirit of Cayenne`.identifierString:
		case $effect`Spirit of Garlic`.identifierString: {
			res.launches = FlavourPicker
			break
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
