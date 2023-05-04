import * as React from 'react'
import { Effect } from 'kolmafia'
import EffectOption from '../Option/EffectOption'
import Picker from '../Picker/Picker'

interface EffectListPseudoPickerArgs {
	effects: Effect[]
	enabled?: (eff: Effect) => boolean
}

export default function EffectListPseudoPicker({
	effects,
	enabled,
}: EffectListPseudoPickerArgs) {
	return (
		<Picker header="Beard schedule">
			{effects.map((effect) => (
				<EffectOption
					effect={effect}
					enabled={enabled ? enabled(effect) : true}
				/>
			))}
		</Picker>
	)
}
