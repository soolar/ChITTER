import * as React from 'react';
import { BrowserEffect } from '../../../guidelines';
import ChitterIcon from './ChitterIcon';

interface EffectIconArgs {
	effect: BrowserEffect;
}

export default function EffectIcon({ effect }: EffectIconArgs) {
	return (
		<ChitterIcon
			image={effect.image}
			tooltip={effect.name}
			borderType="normal"
		/>
	);
}
