import * as React from 'react';
import ChitterIcon from './ChitterIcon';
import { BrowserFamiliar } from '../../../guidelines';
import { pluralize } from '../../../utils';
import { Text, Tooltip, VStack } from '@chakra-ui/react';
import { getExtraFamInfo, getWeirdoDivContents } from '../../familiarHelpers';

interface FamIconArgs {
	fam?: BrowserFamiliar;
	isBjorn?: boolean;
	tooltipOverride?: React.ReactNode;
}

export default function FamIcon({
	fam,
	isBjorn,
	tooltipOverride,
}: FamIconArgs) {
	if (fam) {
		const dropsLeft = fam.dropsLimit - fam.dropsToday;
		const hasDrops = !isBjorn && dropsLeft > 0;
		const allDrops = hasDrops && fam.dropsToday === 0;
		const dropName = fam.drop
			? pluralize(fam.drop, dropsLeft)
			: pluralize(fam.dropName, dropsLeft);
		const extraInfo = getExtraFamInfo(fam);
		const tooltip = tooltipOverride || (
			<VStack spacing="none">
				<Text>{fam.name}</Text>
				<Text>
					the {fam.weight}lb {fam.type}
				</Text>
				{dropName && hasDrops && (
					<Text>
						{dropsLeft} {dropName}
					</Text>
				)}
				{extraInfo.desc && <Text>{extraInfo.desc}</Text>}
			</VStack>
		);
		const weirdoDivContents = getWeirdoDivContents(fam);

		if (weirdoDivContents) {
			return <Tooltip label={tooltip}>{weirdoDivContents}</Tooltip>;
		}

		return (
			<ChitterIcon
				image={fam.image}
				tooltip={tooltip}
				borderType={allDrops ? 'all-drops' : hasDrops ? 'has-drops' : 'normal'}
				extraClass={extraInfo.extraClass}
			/>
		);
	} else {
		return (
			<ChitterIcon
				image="antianti.gif"
				tooltip="You don't have a familiar with you"
			/>
		);
	}
}
