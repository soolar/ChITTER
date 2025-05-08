import { Effect } from 'kolmafia'
import { getEffectInfo } from '../../../util/helpers'
import TypedChitterIcon from './TypedChitterIcon'

interface EffectIconArgs {
	effect: Effect
	small?: boolean
	medium?: boolean
}

export default function EffectIcon({ effect, small, medium }: EffectIconArgs) {
	const info = getEffectInfo(effect)
	// TODO: Better tooltip
	return (
		<TypedChitterIcon info={info} small={small} medium={medium}>
			{info.displayName}
		</TypedChitterIcon>
	)
}
