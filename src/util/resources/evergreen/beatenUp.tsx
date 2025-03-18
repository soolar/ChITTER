import { $effect, $skill, have } from 'libram'
import { EffectListEntry } from '../effectList'
import { mpCost, myMp } from 'kolmafia'

const beatenUp: EffectListEntry = [
	$effect`Beaten Up`.identifierString,
	() => {
		if (
			have($skill`Tongue of the Walrus`) &&
			myMp() >= mpCost($skill`Tongue of the Walrus`)
		) {
			return {
				cleanser: `${mpCost($skill`Tongue of the Walrus`)} MP to cast Tongue of the Walrus`,
			}
		}
		// TODO: Others
	},
]

export default beatenUp
