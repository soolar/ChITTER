import React from 'react'
import { Effect } from 'kolmafia'
import ChitterIcon from './ChitterIcon'

interface EffectIconArgs {
	effect: Effect
}

export default function EffectIcon({ effect }: EffectIconArgs) {
	return (
		<ChitterIcon
			image={effect.image}
			tooltip={effect.name}
			borderType="normal"
		/>
	)
}
