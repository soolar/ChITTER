import * as React from 'react'
import { BrowserEffect } from '../guidelines'
import { parseMods } from '../utils'
import FlavourPicker from './components/Picker/FlavourPicker'
import { $effect } from './fakeLibram'

interface ExtraEffectInfo {
	mods: string
	desc?: React.ReactNode
	launches?: React.ComponentType<Record<string, never>>
}

export function getExtraEffectInfo(eff: BrowserEffect): ExtraEffectInfo {
	const res: ExtraEffectInfo = { mods: eff.mods }

	switch (eff.id) {
		case $effect`Video... Games?`.id: {
			res.mods = 'Basically Everything +5'
			break
		}
		case $effect`Spirit of Bacon Grease`.id:
		case $effect`Spirit of Peppermint`.id:
		case $effect`Spirit of Wormwood`.id:
		case $effect`Spirit of Cayenne`.id:
		case $effect`Spirit of Garlic`.id: {
			res.launches = FlavourPicker
			break
		}
	}

	res.mods = parseMods(res.mods)

	return res
}
