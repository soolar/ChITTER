import * as React from 'react';
import { BrowserFamiliar, BrowserList, BrowserSlot } from '../../../guidelines';
import { showFam } from '../../../utils';
import FamIcon from '../FamIcon';
import FamiliarPicker from '../Picker/FamiliarPicker';
import ItemIcon from '../ItemIcon';
import PickerLauncher from '../Picker/PickerLauncher';
import ProgressBar from '../ProgressBar';
import Brick from './Brick';
import { Flex, Heading, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react';
import { nextLevelInfo } from '../../familiarHelpers';
import FamiliarEquipmentPicker from '../Picker/FamiliarEquipPicker';

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
						<Heading style={{ color: 'blue' }} size="s">
							{currFam.buffedWeight}
						</Heading>
					</Tooltip>
					<Spacer />
					<Heading size="s">{currFam.name}</Heading>
					<Spacer />
				</Flex>
			}
			footer={
				<ProgressBar value={nextInfo.progress} max={nextInfo.goal} desc="exp" />
			}
		>
			<Flex>
				<PickerLauncher
					WrappedPicker={FamiliarPicker}
					pickerProps={{
						type: 'default' as const,
					}}
				>
					<FamIcon fam={currFam} tooltipOverride="Pick a Familiar" />
				</PickerLauncher>
				<Spacer />
				<VStack spacing="none">
					<Tooltip label="Click for Familiar Haiku">
						<Heading size="s" onClick={() => showFam(currFam.id)}>
							{currFam.type}
						</Heading>
					</Tooltip>
					{currFam.desc && <Text>{currFam.desc}</Text>}
				</VStack>
				<Spacer />
				<PickerLauncher
					WrappedPicker={FamiliarEquipmentPicker}
					pickerProps={{}}
				>
					<ItemIcon item={slots.byName.familiar.equipped} />
				</PickerLauncher>
			</Flex>
		</Brick>
	);
}
