import * as React from 'react'
import { BrowserEffect } from '../../../guidelines'
import { parseMods } from '../../../utils'
import EffectIcon from '../Icons/EffectIcon'
import ChitterOption from './ChitterOption'
import OptionText from './OptionText'

interface EffectOptionArgs {
	effect: BrowserEffect
	enabled?: boolean
}

export default function EffectOption({ effect, enabled }: EffectOptionArgs) {
	return (
		<ChitterOption
			icon={<EffectIcon effect={effect} />}
			enabled={enabled ?? true}
		>
			<OptionText subject={effect.name} desc={parseMods(effect.mods)} />
		</ChitterOption>
	)
}
