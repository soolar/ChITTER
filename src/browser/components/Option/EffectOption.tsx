import * as React from 'react'
import { Effect, stringModifier } from 'kolmafia'
import { parseMods } from '../../../utils'
import EffectIcon from '../Icons/EffectIcon'
import ChitterOption from './ChitterOption'
import OptionText from './OptionText'

interface EffectOptionArgs {
	effect: Effect
	enabled?: boolean
}

export default function EffectOption({ effect, enabled }: EffectOptionArgs) {
	const name = effect.toString()
	const mods = stringModifier(effect, 'Evaluated Modifiers')
	return (
		<ChitterOption
			icon={<EffectIcon effect={effect} />}
			enabled={enabled ?? true}
		>
			<OptionText subject={name} desc={parseMods(mods)} />
		</ChitterOption>
	)
}
