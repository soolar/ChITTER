import * as React from 'react'
import { Effect, toString } from 'kolmafia'
import ChitterIcon from './ChitterIcon'

interface EffectIconArgs {
	effect: Effect
}

export default function EffectIcon({ effect }: EffectIconArgs) {
	const name = toString(effect as unknown as string)

	return <ChitterIcon image={effect.image} tooltip={name} borderType="normal" />
}
