import * as React from 'react'
import { Effect } from 'kolmafia'
import EffectOption from '../Option/EffectOption'
import Picker from '../Picker/Picker'

interface EffectListPseudoPickerArgs {
	effects: Effect[]
	header: string
	enabled?: (eff: Effect) => boolean
}

export default function EffectListPseudoPicker({
	effects,
	header,
	enabled,
}: EffectListPseudoPickerArgs) {
	return (
		<Picker header={header}>
			{effects.map((effect) => (
				<EffectOption
					key={`effpicker${effect.name}`}
					effect={effect}
					enabled={enabled ? enabled(effect) : true}
				/>
			))}
		</Picker>
	)
}
