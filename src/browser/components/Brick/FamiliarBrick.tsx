import * as React from 'react';
import { nextLevelInfo } from '../../../familiarHelpers';
import { BrowserFamiliar, BrowserList, BrowserSlot } from '../../../guidelines';
import { showFam } from '../../../utils';
import FamIcon from '../FamIcon';
import FamiliarPicker from '../Picker/FamiliarPicker';
import ItemIcon from '../ItemIcon';
import PickerLauncher from '../Picker/PickerLauncher';
import ProgressBar from '../ProgressBar';
import Brick from './Brick';
import { Flex, Heading, Spacer, Text, Tooltip } from '@chakra-ui/react';

declare const familiars: BrowserList<BrowserFamiliar>;
declare const slots: BrowserList<BrowserSlot>;

export default function FamiliarBrick() {
	const currFam = familiars.active[0];
	const nextInfo = nextLevelInfo(currFam);

	return (
		<Brick
			name="familiar"
			header={
				<Flex>
					<Tooltip label={`Buffed Weight (Base Weight: ${currFam.weight} lb)`}>
						<Heading style={{ color: 'blue' }}>{currFam.buffedWeight}</Heading>
					</Tooltip>
					<Spacer />
					<Heading>{currFam.name}</Heading>
					<Spacer />
				</Flex>
			}
			body={
				<Flex>
					<PickerLauncher
						WrappedPicker={FamiliarPicker}
						pickerProps={{
							type: 'default' as const,
						}}
					>
						<FamIcon fam={currFam} />
					</PickerLauncher>
					<Spacer />
					<Text className="info" onClick={() => showFam(currFam.id)}>
						{currFam.type}
					</Text>
					<Spacer />
					<ItemIcon item={slots.byName.familiar.equipped} />
				</Flex>
			}
			footer={
				<ProgressBar value={nextInfo.progress} max={nextInfo.goal} desc="exp" />
			}
		/>
	);
}
