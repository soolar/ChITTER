import { Effect } from 'kolmafia'
import Picker from './Picker'
import EffectOption from '../Option/EffectOption'

interface EffectListPseudoPickerArgs {
	header: string
	effects: Effect[]
	enabled?: (eff: Effect) => boolean
}

export default function EffectListPseudoPicker({
	header,
	effects,
	enabled,
}: EffectListPseudoPickerArgs) {
	return (
		<Picker header={header}>
			{effects.map((effect) => (
				<EffectOption
					effect={effect}
					enabled={enabled ? enabled(effect) : true}
				/>
			))}
		</Picker>
	)
}
