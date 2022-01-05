import * as React from 'react';
import Icon from './Icon';
import { BrowserFamiliar } from '../../guidelines';
import { pluralize } from '../../utils';

interface FamIconArgs {
	fam: BrowserFamiliar | undefined;
	isBjorn?: boolean;
}

export default function FamIcon({ fam, isBjorn = false }: FamIconArgs) {
	if (fam) {
		const dropsLeft = fam.dropsLimit - fam.dropsToday;
		const hasDrops = !isBjorn && dropsLeft > 0;
		const allDrops = hasDrops && fam.dropsToday === 0;
		const dropName = fam.drop
			? pluralize(fam.drop, dropsLeft)
			: pluralize(fam.dropName, dropsLeft);

		return (
			<span>
				<Icon
					image={fam.image}
					title={`${fam.name} (the ${fam.weight}lb ${fam.type})${
						dropName && hasDrops ? ` (${dropsLeft} ${dropName})` : ''
					}`}
					borderType={
						allDrops ? 'all-drops' : hasDrops ? 'has-drops' : 'normal'
					}
				/>
			</span>
		);
	} else {
		return (
			<span>
				<Icon image="antianti.gif" title="You don't have a familiar with you" />
			</span>
		);
	}
}
