import { Effect } from 'kolmafia'
import ChitterIcon from './ChitterIcon'

interface EffectIconArgs {
	effect: Effect
	small?: boolean
	medium?: boolean
}

export default function EffectIcon({ effect, small, medium }: EffectIconArgs) {
	return (
		<ChitterIcon
			image={effect.image}
			tooltip={effect.name}
			borderType="normal"
			small={small}
			medium={medium}
		/>
	)
}
