import { Effect } from 'kolmafia'
import ChitterIcon from './ChitterIcon'
import { getEffectInfo } from '../../../util/helpers'

interface EffectIconArgs {
	effect: Effect
	small?: boolean
	medium?: boolean
}

export default function EffectIcon({ effect, small, medium }: EffectIconArgs) {
	const info = getEffectInfo(effect)
	return (
		<ChitterIcon
			image={info.image}
			tooltip={info.displayName}
			borderType="normal"
			small={small}
			medium={medium}
		/>
	)
}
