import { Effect, stringModifier, toEffect } from 'kolmafia'
//import { $effect } from 'libram'
import * as React from 'react'
import { parseMods } from '../utils'
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
		case toEffect(`Video... Games?`): {
			res.mods = 'Basically Everything +5'
			break
		}
		case toEffect(`Spirit of Bacon Grease`):
		case toEffect(`Spirit of Peppermint`):
		case toEffect(`Spirit of Wormwood`):
		case toEffect(`Spirit of Cayenne`):
		case toEffect(`Spirit of Garlic`): {
			res.launches = FlavourPicker
			break
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
