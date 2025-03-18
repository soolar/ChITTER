import { Effect } from 'kolmafia'
import ChitterOption from './ChitterOption'
import EffectIcon from '../Icons/EffectIcon'
import OptionText from './OptionText'
import { getEffectInfo } from '../../../util/helpers'

interface EffectOptionArgs {
	effect: Effect
	enabled?: boolean
}

export default function EffectOption({ effect, enabled }: EffectOptionArgs) {
	const effInfo = getEffectInfo(effect)
	return (
		<ChitterOption
			icon={<EffectIcon effect={effect} />}
			enabled={enabled ?? true}
		>
			<OptionText subject={effInfo.displayName} desc={effInfo.mods} />
		</ChitterOption>
	)
}
