import { $effect, get } from 'libram'
import { EffectListEntry } from '../effectList'

const olfaction: EffectListEntry = [
	$effect`On the Trail`.identifierString,
	(effectInfo) => {
		effectInfo.mods = get('olfactedMonster')?.identifierString ?? ''
		return { skipParse: true }
	},
]

export default olfaction
