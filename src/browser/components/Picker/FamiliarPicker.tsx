import { Button, Flex, Spacer, Text, Wrap, WrapItem } from '@chakra-ui/react';
import * as React from 'react';
import { BrowserCharacter } from '../../../character';
import { BrowserFamiliar, BrowserList } from '../../../guidelines';
import FamIcon from '../FamIcon';
import Icon from '../Icon';
import Picker from './Picker';

declare const familiars: BrowserList<BrowserFamiliar>;
declare const my: BrowserCharacter;

export type FamiliarPickerType = 'default' | 'bjorn' | 'crown';

interface FamiliarPickerArgs {
	type?: FamiliarPickerType;
}

export default function FamiliarPicker({
	type = 'default',
}: FamiliarPickerArgs) {
	const activeFam =
		type === 'default'
			? familiars.active[0]
			: type === 'bjorn'
			? my.bjornFam
			: my.crownFam;

	return (
		<Picker
			header="Change Familiar"
			footer={
				<Flex>
					<Icon image="terrarium.gif" tooltip="Visit your terrarium" />
					<Spacer />
					<Text>Visit Your Terrarium</Text>
					<Spacer />
					<Icon image="antianti.gif" tooltip="Use no familiar" />
				</Flex>
			}
		>
			<Wrap>
				{familiars.favorites
					.filter((fam) => fam !== activeFam)
					.map((fam) => (
						<WrapItem>
							<Button variant="unstyled">
								<FamIcon fam={fam} />
							</Button>
						</WrapItem>
					))}
			</Wrap>
		</Picker>
	);
}
