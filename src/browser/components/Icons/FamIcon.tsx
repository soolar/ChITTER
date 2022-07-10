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
		const extraInfo = getExtraFamInfo(fam, true, !!isBjorn);
		const tooltip = tooltipOverride || (
			<VStack spacing="none">
				<Text>{fam.name}</Text>
				<Text>
					the {fam.weight}lb {fam.type}
				</Text>
				{extraInfo.desc}
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
				borderType={extraInfo.borderType}
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
