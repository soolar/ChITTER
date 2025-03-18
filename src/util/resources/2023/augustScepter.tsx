import { $effect, $familiar, $item, $slot } from 'libram'
import { EffectListEntry } from '../effectList'
import { equippedItem, myFamiliar } from 'kolmafia'
import { evaluatedModifiers, parseMods } from '../..'

export const augustScepterEffects: EffectListEntry[] = [
	[
		$effect`Offhand Remarkable`.identifierString,
		(effectInfo) => {
			const myOffhand = equippedItem($slot`off-hand`)
			const myFamOffhand =
				myFamiliar() === $familiar`Left-Hand Man`
					? equippedItem($slot`familiar`)
					: $item.none
			const myOffhands = [
				...(myOffhand !== $item.none ? [myOffhand] : []),
				...(myFamOffhand !== $item.none ? [myFamOffhand] : []),
			]
			effectInfo.mods = 'Doubles off-hands (Currently: '
			if (myOffhands.length > 0) {
				const modsToAdd = parseMods(
					myOffhands
						.map((offhand) => evaluatedModifiers(offhand))
						.filter((modifier) => modifier.length > 0)
						.join(', '),
				)
				effectInfo.mods += modsToAdd !== '' ? modsToAdd : 'Nothing?'
			} else {
				effectInfo.mods += 'Nothing'
			}
			effectInfo.mods += ')'
			return { skipParse: true }
		},
	],
]
