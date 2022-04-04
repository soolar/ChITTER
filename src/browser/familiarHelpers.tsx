import { BrowserFamiliar } from '../guidelines';
import { HStack, Image } from '@chakra-ui/react';
import * as React from 'react';

export const nextLevelInfo = (fam: BrowserFamiliar) => {
	for (let i = 2; i <= 20; ++i) {
		const nextGoal = i * i;
		if (nextGoal > fam.experience) {
			const prevGoal = i === 2 ? 0 : (i - 1) * (i - 1);
			return { progress: fam.experience - prevGoal, goal: nextGoal - prevGoal };
		}
	}
	return { progress: 1, goal: 1 };
};

export function getWeirdoDivContents(fam: BrowserFamiliar) {
	switch (fam.type) {
		case 'Melodramedary':
			return (
				<HStack className={`chit-icon ${fam.extraClass}`} spacing="0">
					<Image src="/images/otherimages/camelfam_left.gif" border={0} />
					{Array(Math.floor(fam.weight / 5)).fill(
						<Image src="/images/otherimages/camelfam_middle.gif" border={0} />
					)}
					<Image src="/images/otherimages/camelfam_right.gif" border={0} />
				</HStack>
			);
	}

	return null;
}
