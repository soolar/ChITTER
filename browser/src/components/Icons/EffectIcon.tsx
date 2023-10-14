import * as React from 'react'
import { Effect, toString } from 'kolmafia'
import ChitterIcon, { IconSize } from './ChitterIcon'

interface EffectIconArgs {
	effect: Effect
	size?: IconSize
}

export default function EffectIcon({ effect, size }: EffectIconArgs) {
	const name = toString(effect as unknown as string)

	return <ChitterIcon image={effect.image} tooltip={name} borderType="normal" size={size} />
}
