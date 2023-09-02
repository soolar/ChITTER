import { Effect, stringModifier, toEffect } from 'kolmafia'
import { $effect } from 'libram'
import * as React from 'react'
import { parseMods } from './utils'
import FlavourPicker from './components/Picker/FlavourPicker'

interface ExtraEffectInfo {
	mods: string
	desc?: React.ReactNode
	launches?: React.ComponentType<Record<string, never>>
}

export function useExtraEffectInfo(eff: Effect): ExtraEffectInfo {
	const res: ExtraEffectInfo = {
		mods: stringModifier(eff, 'Evaluated Modifiers'),
	}

	switch (eff) {
		case $effect`Video... Games?`: {
			res.mods = 'Basically Everything +5'
			break
		}
		case $effect`Spirit of Bacon Grease`:
		case $effect`Spirit of Peppermint`:
		case $effect`Spirit of Wormwood`:
		case $effect`Spirit of Cayenne`:
		case $effect`Spirit of Garlic`: {
			res.launches = FlavourPicker
			break
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
