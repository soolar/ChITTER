import { $effect, get } from 'libram'
import { EffectListEntry } from '../effectList'

export const citizenOfAZone: EffectListEntry = [
	$effect`Citizen of a Zone`.identifierString,
	(effectInfo) => {
		effectInfo.displayName = `Citizen of ${get('_citizenZone')}`
		effectInfo.displayTurns = 'Today'
	},
]
