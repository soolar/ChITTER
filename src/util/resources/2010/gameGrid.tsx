import { $effect } from 'libram'
import { EffectListEntry } from '../effectList'

export const videoGames: EffectListEntry = [
	$effect`Video... Games?`.identifierString,
	(effectInfo) => {
		effectInfo.mods = 'Basically Everything +5'
		return { skipParse: true }
	},
]
